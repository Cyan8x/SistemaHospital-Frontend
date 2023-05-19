import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, switchMap } from 'rxjs';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { Paciente } from 'src/app/_model/paciente';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  paciente: Paciente;

  estadoAtencion$: Observable<EstadoAtencion[]>;

  esActivo: boolean;
  esFavorito: boolean;
  idEstadoAtencionSeleccionado: number;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private estadoAtencionService: EstadoAtencionService) {

  }

  ngOnInit(): void {
    this.paciente = { ...this.data };

    if (this.data != null && this.data.paciente_id > 0) {
      this.idEstadoAtencionSeleccionado = this.data.estadoAtencion.estado_atencion_id;
      this.esActivo = this.data.esActivo;
      this.esFavorito = this.data.esFavorito;
    }

    this.listarEstadoAsistencia();
  }

  listarEstadoAsistencia() {
    this.estadoAtencion$ = this.estadoAtencionService.listar();
  }

  operar() {
    let estadoAtencion = new EstadoAtencion();
    estadoAtencion.estado_atencion_id = this.idEstadoAtencionSeleccionado;

    this.paciente.estadoAtencion = estadoAtencion;
    // console.log(this.paciente);
    this.paciente.esActivo = this.esActivo;
    this.paciente.esFavorito = this.esFavorito;

    if (this.paciente != null && this.paciente.paciente_id > 0) {
      //MODIFICAR
      this.pacienteService
        .modificar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listar();
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.pacienteService
        .registrar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listar();
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
