import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import {
  MtxCalendarView,
  MtxDatetimepickerMode,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';

import { UntypedFormControl } from '@angular/forms';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Notificacion } from 'src/app/_model/notificacion';
import { NotificacionService } from 'src/app/_service/notificacion.service';



@Component({
  selector: 'app-procedimiento-dialog',
  templateUrl: './procedimiento-dialog.component.html',
  styleUrls: ['./procedimiento-dialog.component.css']
})
export class ProcedimientoDialogComponent implements OnInit {
  procedimiento: Procedimiento;
  paciente: Paciente;

  tipo: string = 'Registro';
  miInput: string = '';
  verificar: boolean = true;

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  // multiYearSelector = false;
  // touchUi = false;
  // twelvehour = true;
  // timeInterval = 1;
  // timeInput = true;
  datetimeFechaInicio = new UntypedFormControl();
  datetimeFechaFin = new UntypedFormControl();

  constructor(
    private dialogRef: MatDialogRef<ProcedimientoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private procedimientoService: ProcedimientoService,
    private renderer: Renderer2,
    private usuarioService: UsuarioService,
    private notificacionService:NotificacionService) {

  }

  ngOnInit(): void {
    this.procedimiento = { ...this.data.procedimiento };
    this.paciente = { ...this.data.paciente };

    if (this.procedimiento != null && this.procedimiento.procedimiento_id > 0) {
      this.tipo = 'Edicion'
      this.datetimeFechaInicio = new UntypedFormControl(this.procedimiento.fechaHoraInicio);
      this.datetimeFechaFin = new UntypedFormControl(this.procedimiento.fechaHoraFin);
    }
  }

  ngAfterViewInit() {
    this.agregarEstilosDinamicos();
  }

  operar() {
    this.procedimiento.fechaHoraInicio = moment(this.datetimeFechaInicio.value).format('YYYY-MM-DDTHH:mm:ss');
    this.procedimiento.fechaHoraFin = moment(this.datetimeFechaFin.value).format('YYYY-MM-DDTHH:mm:ss');
    this.procedimiento.paciente = this.paciente;
    this.procedimiento.usuario = this.usuarioService.getUsuarioLogueado();
    this.procedimiento.es_terminado = false;
    this.procedimiento.usuario_creador = this.usuarioService.getUsuarioLogueado().usuario;

    //CREANDO NOTIFICACION
    let notificacion = new Notificacion();
    notificacion.fechaHoraNotificacion = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    notificacion.paciente = this.paciente;
    notificacion.usuarioOrigen = this.usuarioService.getUsuarioLogueado();
    notificacion.usuarioDestino = this.paciente.usuario.usuario_id;

    if (this.procedimiento != null && this.procedimiento.procedimiento_id > 0) {
      notificacion.causa = "Se actualizó un procedimiento";
      //MODIFICAR
      this.procedimientoService
        .modificar(this.procedimiento)
        .pipe(
          switchMap(() => {
            return this.procedimientoService.listarProcedimientosPendientesPorPaciente(this.paciente.paciente_id);
          })
        )
        .subscribe((data) => {
          this.procedimientoService.setProcedimientoCambio(data);
          this.procedimientoService.setMensajeCambio('Se modificó.');
          if (this.paciente.usuario.usuario_id != this.usuarioService.getUsuarioLogueado().usuario_id) {
            this.notificacionService.registrar(notificacion).subscribe(data=>{
            });
          }
        });
    } else {
      notificacion.causa = "Se creó un procedimiento";
      //REGISTRAR
      this.procedimiento.fechaCreacionProced = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
      this.procedimientoService
        .registrar(this.procedimiento)
        .pipe(
          switchMap(() => {
            return this.procedimientoService.listarProcedimientosPendientesPorPaciente(this.paciente.paciente_id);
          })
        )
        .subscribe((data) => {
          this.procedimientoService.setProcedimientoCambio(data);
          this.procedimientoService.setMensajeCambio('Se registró.');
          if (this.paciente.usuario.usuario_id != this.usuarioService.getUsuarioLogueado().usuario_id) {
            this.notificacionService.registrar(notificacion).subscribe(data=>{
            });
          }
        });
    }

    this.cerrar();
  }

  validarInput() {
    if (this.procedimiento.procedimiento.trim() === ''
      // || this.procedimiento.fechaHoraInicio.trim() === '' ||
      // this.procedimiento.fechaHoraInicio.trim() === ''
    ) {
      this.verificar = true;
    } else {
      this.verificar = false;
    }

  }

  cerrar() {
    this.dialogRef.close();
  }

  agregarEstilosDinamicos() {
    const styles = `
      .mtx-calendar{
        background: #fff;
        box-shadow: 7px 9px 13px 4px rgba(0,0,0,0.71);
      }
      .mtx-calendar-header{
        background: #3f48cc;
        color:#fff;
      }
    `;

    const styleElement = this.renderer.createElement('style');
    const styleText = this.renderer.createText(styles);

    this.renderer.appendChild(styleElement, styleText);
    this.renderer.appendChild(document.head, styleElement);
  }
}
