import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { switchMap } from 'rxjs';
import { Asistencia } from 'src/app/_model/asistencia';
import { EstadoAsistencia } from 'src/app/_model/estadoAsistencia';
import { AsistenciaService } from 'src/app/_service/asistencia.service';
import { EstadoAsistenciaService } from 'src/app/_service/estado-asistencia.service';

@Component({
  selector: 'app-asistencia-dialog',
  templateUrl: './asistencia-dialog.component.html',
  styleUrls: ['./asistencia-dialog.component.css']
})
export class AsistenciaDialogComponent implements OnInit {

  asistencia: Asistencia;
  tipo: string = 'Registro';

  miInput: string = '';
  verificar: boolean = true;

  estadosAsistencia: EstadoAsistencia[];
  estadoAsistenciaSeleccionado: EstadoAsistencia;

  constructor(
    private dialogRef: MatDialogRef<Asistencia>,
    @Inject(MAT_DIALOG_DATA) private data: Asistencia,
    private asistenciaService: AsistenciaService,
    private estadoAsistenciaService: EstadoAsistenciaService
  ) { }

  ngOnInit(): void {
    this.asistencia = { ...this.data };
    if (this.data != null && this.data.asistencia_id > 0) {
      this.tipo = 'Edicion'
      this.estadoAsistenciaSeleccionado = this.data.estadoAsistencia;
    }

    this.estadoAsistenciaService.listar().subscribe(data => {
      this.estadosAsistencia = data;
    });
  }

  operar() {
    this.asistencia.estadoAsistencia = this.estadoAsistenciaSeleccionado;
    if (this.asistencia != null && this.asistencia.asistencia_id > 0) {
      //MODIFICAR
      this.asistenciaService
        .modificar(this.asistencia)
        .pipe(
          switchMap(() => {
            return this.asistenciaService.asistenciasOfUsuario(this.asistencia.usuario.usuario_id);
          })
        )
        .subscribe((data) => {
          this.asistenciaService.setAsistenciaCambio(data);
          this.asistenciaService.setMensajeCambio('Se modificó.');
        });
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
