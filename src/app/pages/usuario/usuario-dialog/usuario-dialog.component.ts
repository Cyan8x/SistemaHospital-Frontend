import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']
})
export class UsuarioDialogComponent implements OnInit {

  usuario: Usuario;

  esActivo: boolean = false;

  tipo: string = 'Registro';

  verificar: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private usuarioService: UsuarioService) {

  }

  ngOnInit(): void {
    this.usuario = { ...this.data };

    if (this.data != null && this.data.usuario_id > 0) {
      this.esActivo = this.data.esActivoUsuario;
      this.tipo = 'Edicion';
    }
  }

  operar() {
    this.usuario.esActivoUsuario = this.esActivo;

    if (this.usuario != null && this.usuario.usuario_id > 0) {
      //MODIFICAR

      if (this.usuario.emailUsuario == '') {
        this.usuario.emailUsuario = null;
      }

      if (this.usuario.telefonoUsuario == '') {
        this.usuario.telefonoUsuario = null;
      }

      this.usuarioService
        .modificar(this.usuario)
        .pipe(
          switchMap(() => {
            return this.usuarioService.listar();
          })
        )
        .subscribe((data) => {
          this.usuarioService.setUsuarioCambio(data);
          this.usuarioService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.usuarioService
        .registrar(this.usuario)
        .pipe(
          switchMap(() => {
            return this.usuarioService.listar();
          })
        )
        .subscribe((data) => {
          this.usuarioService.setUsuarioCambio(data);
          this.usuarioService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  validarInput() {
    if (this.usuario.usuario.trim() === '' ||
      this.usuario.password.trim() === '' ||
      this.usuario.nombresUsuario.trim() === '' ||
      this.usuario.apellidosUsuario.trim() === '' ||
      this.usuario.dniUsuario === null || this.usuario.dniUsuario === undefined) {
      this.verificar = true;
    } else {
      this.verificar = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
