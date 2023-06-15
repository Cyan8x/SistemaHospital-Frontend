import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Asistencia } from 'src/app/_model/asistencia';
import { AsistenciaService } from 'src/app/_service/asistencia.service';

@Component({
  selector: 'app-eliminar-asistencia-dialog',
  templateUrl: './eliminar-asistencia-dialog.component.html',
  styleUrls: ['./eliminar-asistencia-dialog.component.css']
})
export class EliminarAsistenciaDialogComponent implements OnInit {

  asistencia: Asistencia;

  constructor(
    private dialogRef: MatDialogRef<Asistencia>,
    @Inject(MAT_DIALOG_DATA) private data: Asistencia,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit(): void {
    this.asistencia = { ...this.data };
  }

  eliminar(asistencia: Asistencia) {
    this.asistenciaService
      .delete(asistencia.asistencia_id)
      .pipe(
        switchMap(() => {
          return this.asistenciaService.listar();
        })
      )
      .subscribe((data) => {
        this.asistenciaService.setAsistenciaCambio(data);
        this.asistenciaService.setMensajeCambio('Se eliminó.');
      });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
