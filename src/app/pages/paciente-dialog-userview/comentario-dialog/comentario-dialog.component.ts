import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comentario } from 'src/app/_model/comentario';
import { Paciente } from 'src/app/_model/paciente';
import { ComentarioService } from 'src/app/_service/comentario.service';
import * as moment from 'moment';
import { Usuario } from 'src/app/_model/usuario';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-comentario-dialog',
  templateUrl: './comentario-dialog.component.html',
  styleUrls: ['./comentario-dialog.component.css']
})
export class ComentarioDialogComponent implements OnInit {
  comentario: Comentario;
  paciente: Paciente;

  tipo: string = 'Registro';
  miInput: string = '';
  verificar: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<ComentarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private comentarioService: ComentarioService) {

  }

  ngOnInit(): void {
    this.comentario = { ...this.data.comentario };
    this.paciente = { ...this.data.paciente };

    if (this.comentario != null && this.comentario.comentario_id > 0) {
      this.tipo = 'Edicion'
    }
  }

  operar() {
    this.comentario.fechaHoraComentario = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    this.comentario.paciente = this.paciente;
    let usuario = new Usuario();
    usuario.usuario_id = 1;
    this.comentario.usuario = usuario;
    if (this.comentario != null && this.comentario.comentario_id > 0) {
      //MODIFICAR
      this.comentarioService
        .modificar(this.comentario)
        .pipe(
          switchMap(() => {
            return this.comentarioService.listar();
          })
        )
        .subscribe((data) => {
          this.comentarioService.setComentarioCambio(data);
          this.comentarioService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.comentarioService
        .registrar(this.comentario)
        .pipe(
          switchMap(() => {
            return this.comentarioService.listar();
          })
        )
        .subscribe((data) => {
          this.comentarioService.setComentarioCambio(data);
          this.comentarioService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  validarInput() {
    if (this.comentario.comentario.trim() === '') {
      this.verificar = true;
    } else {
      this.verificar = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
