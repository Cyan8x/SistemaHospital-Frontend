import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, switchMap } from 'rxjs';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { Paciente } from 'src/app/_model/paciente';
import { Usuario } from 'src/app/_model/usuario';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { SuccessMessageDialogComponent } from '../../success-message-dialog/success-message-dialog.component';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  tiposDocumento: string[] = ['DNI', 'Carnet de Extranjeria'];
  tipoSeleccionado: string = this.tiposDocumento[0];

  paciente: Paciente;

  estadoAtencion$: Observable<EstadoAtencion[]>;

  esActivo: boolean = false;
  esFavorito: boolean = false;
  idEstadoAtencionSeleccionado: number;

  tipo: string = 'Registro';

  miInput: string = '';
  verificar: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private dialog: MatDialog,
    private pacienteService: PacienteService,
    private estadoAtencionService: EstadoAtencionService,
    private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.paciente = { ...this.data };

    if (this.data != null && this.data.paciente_id > 0) {
      this.idEstadoAtencionSeleccionado = this.data.estadoAtencion.estado_atencion_id;
      this.esActivo = this.data.esActivo;
      this.esFavorito = this.data.esFavorito;
      this.tipo = 'Edicion';
      this.tipoSeleccionado = this.data.tipoDocumento;
    }

    this.listarEstadoAsistencia();
  }

  listarEstadoAsistencia() {
    this.estadoAtencion$ = this.estadoAtencionService.listar();
  }

  operar() {
    if (this.idEstadoAtencionSeleccionado != null) {
      let estadoAtencion = new EstadoAtencion();
      estadoAtencion.estado_atencion_id = this.idEstadoAtencionSeleccionado;
      this.paciente.estadoAtencion = estadoAtencion;
    } else {
      this.paciente.estadoAtencion = null;
    }

    this.paciente.esActivo = this.esActivo;
    this.paciente.esFavorito = false;

    this.paciente.tipoDocumento = this.tipoSeleccionado;
    if (this.tipoSeleccionado == this.tiposDocumento[0]) {
      this.paciente.carneExtranjeria = null;
    } else if (this.tipoSeleccionado == this.tiposDocumento[1]) {
      this.paciente.dniPaciente = null;
    } else {
      this.paciente.tipoDocumento = 'noTipoDocumento'
      this.paciente.carneExtranjeria = null;
      this.paciente.dniPaciente = null;
    }

    if(this.paciente.direccionPaciente == ''){
      this.paciente.direccionPaciente = null;
    }
    if (this.paciente.emailPaciente == '') {
      this.paciente.emailPaciente = null;
    }



    if (this.paciente != null && this.paciente.paciente_id > 0) {
      //MODIFICAR

      if (this.paciente.emailPaciente == '') {
        this.paciente.emailPaciente = null;
      }

      if (this.paciente.telefonoPaciente == '') {
        this.paciente.telefonoPaciente = null;
      }

      if (this.paciente.direccionPaciente == '') {
        this.paciente.direccionPaciente = null;
      }

      this.pacienteService
        .modificar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listarPagination(0,10);
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.successMessageDialog('Se actualizó el paciente exitosamente.', this.dialog);
          this.cerrar();
        });
    } else {
      //REGISTRAR
      this.paciente.fechaCreacionPaciente = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
      this.paciente.usuario = this.usuarioService.getUsuarioLogueado();
      this.pacienteService
        .registrar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listarPagination(0,10);
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.successMessageDialog('Se registró el paciente exitosamente.', this.dialog);
          this.cerrar();
        });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
