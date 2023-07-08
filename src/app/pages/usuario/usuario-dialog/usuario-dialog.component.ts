import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Rol } from 'src/app/_model/rol';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import * as moment from 'moment';
import { RolService } from 'src/app/_service/rol.service';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']
})
export class UsuarioDialogComponent implements OnInit {

  roles: Rol[];
  rolSeleccionado: Rol;

  menus: Menu[];

  usuario: Usuario;

  passwordUsuario: string;

  mostrarInput: boolean = false;
  textoBoton: string = "Modificar Contraseña";
  color: string = "primary"

  esActivo: boolean = false;

  tipo: string = 'Registro';

  verificar: boolean = true;


  constructor(
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private menuService: MenuService) {

  }

  ngOnInit(): void {
    this.usuario = { ...this.data };



    this.rolService.listar().subscribe(data => {
      this.roles = data;
      if (this.data != null && this.data.usuario_id > 0) {
        this.esActivo = this.data.esActivoUsuario;
        this.tipo = 'Edicion';
        this.roles.forEach((rol) => {
          if (rol.rol_id == this.data.rol.rol_id) {
            this.rolSeleccionado = rol;
          }
        });
      } else {
        this.rolSeleccionado = this.roles[1];
      }
    });

    this.menuService.listarPorUsuario(this.data.usuario).subscribe(data =>{
      this.menus = data;
    })

  }

  operar() {
    this.usuario.esActivoUsuario = this.esActivo;
    this.usuario.rol = this.rolSeleccionado;

    if (this.usuario != null && this.usuario.usuario_id > 0) {
      //MODIFICAR

      if (this.mostrarInput) {
        this.usuario.password = this.passwordUsuario;
      }

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
          this.menuService.asignarMenusUsuario(this.usuario.usuario_id,this.menus).subscribe(data=>{
          });
        });
    } else {
      //REGISTRAR
      this.usuario.password = this.passwordUsuario;
      this.usuario.fechaCreacionUsuario = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
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
    if (this.data != null && this.data.usuario_id > 0) {
      if (this.usuario.usuario.trim() === '' ||
        this.usuario.password.trim() === '' ||
        this.usuario.nombresUsuario.trim() === '' ||
        this.usuario.apellidosUsuario.trim() === '' ||
        this.usuario.dniUsuario === null || this.usuario.dniUsuario === undefined) {
        this.verificar = true;
      } else {
        this.verificar = false;
      }
    }else{
      this.verificar = false;
    }
  }

  validarCambio(nuevoValor: Rol) {
    if (this.tipo == 'Edicion') {
      if (nuevoValor.rol_id !== this.usuario.rol.rol_id) {
        this.verificar = false;
      } else {
        this.verificar = true;
      }
    }
  }

  toggleInput() {
    this.mostrarInput = !this.mostrarInput;

    if (this.mostrarInput) {
      this.textoBoton = "Ya no modificar contraseña";
      this.color = "accent"
    } else {
      this.textoBoton = "Modificar Contraseña";
      this.color = "primary"
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
