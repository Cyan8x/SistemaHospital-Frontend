import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Asistencia } from 'src/app/_model/asistencia';
import { JustificacionTardanza } from 'src/app/_model/justificacionTardanza';
import { Usuario } from 'src/app/_model/usuario';
import { AsistenciaService } from 'src/app/_service/asistencia.service';

@Component({
  selector: 'app-tardanza-dialog',
  templateUrl: './tardanza-dialog.component.html',
  styleUrls: ['./tardanza-dialog.component.css']
})
export class TardanzaDialogComponent implements OnInit {

  usuario_id: number;
  justificacion: string;

  miInput: string = '';
  verificar: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<Asistencia>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit(): void {
    this.usuario_id = this.data.usuario_id ;
  }

  operar() {
    let justificacionTardanza = new JustificacionTardanza();
    justificacionTardanza.usuario_id = this.usuario_id;
    justificacionTardanza.justificacion = this.justificacion;

    if (justificacionTardanza.usuario_id != null && justificacionTardanza.usuario_id != 0 && justificacionTardanza.justificacion != null) {
      //MODIFICAR
      this.asistenciaService.justificarTardanza(justificacionTardanza).subscribe((data) => {
        });
    }
    this.cerrar();
  }

  validarInput() {
    this.verificar = this.justificacion.trim() === '';
  }

  cerrar() {
    this.dialogRef.close();
  }
}
