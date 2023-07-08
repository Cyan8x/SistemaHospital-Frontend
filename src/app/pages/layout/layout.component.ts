import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuscarComponent } from '../buscar/buscar.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/_service/menu.service';
import { Menu } from 'src/app/_model/menu';
import { LoginService } from 'src/app/_service/login.service';
import { AsistenciaService } from 'src/app/_service/asistencia.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { TardanzaDialogComponent } from './tardanza-dialog/tardanza-dialog.component';
import { NotificacionService } from 'src/app/_service/notificacion.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  title = 'SistemaHospital-Frontend';
  usuarioLogueado: string;
  usuario: Usuario;
  mostrarBotonAsistencia: boolean = true;

  cantNotifi: number;

  menus: Menu[];

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService,
    private loginService: LoginService,
    private asistenciaService: AsistenciaService,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionService
  ) { };

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;

    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(
      data => {
        this.usuario = data;
        this.usuarioService.setUsuarioLogueado(this.usuario);

        this.asistenciaService.verificarAsistenciaUsuarioHoy(this.usuario.usuario_id).subscribe(data => {
          if (data.message.includes("SI")) {
            this.mostrarBotonAsistencia = false;
          } else if (data.message.includes("NO")) {
            this.mostrarBotonAsistencia = true;
          }
        });

        this.notificacionService.variable$.subscribe(valor =>{
          this.cantNotifi = valor;
        });

        this.notificacionService.cantidadaNotificacionesPorUsuario(this.usuario.usuario_id).subscribe(data => {
          if (data > 0) {
            this.cantNotifi = data;
          } else {
            this.cantNotifi = null;
          }
        });
      }
    );

    this.menuService.listarPorUsuario(this.usuarioLogueado).subscribe(data => {
      this.menus = data;
    });
  }

  ngAfterViewChecked(){
    // this.notificacionService.cantidadaNotificacionesPorUsuario(this.usuario.usuario_id).subscribe(data => {
    //   if (data > 0) {
    //     this.cantNotifi = data;
    //   } else {
    //     this.cantNotifi = null;
    //   }
    // });
  }


  buscarDialog() {
    this.dialog.open(BuscarComponent, {
      width: '100%',
      height: '95%'
    });
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

  asistencia() {
    this.asistenciaService.registrarAsistenciaConValidaciones(this.usuario.usuario_id).subscribe(data => {
      if (data.message.includes("Tardanza")) {
        this.dialog.open(TardanzaDialogComponent, {
          width: '400px',
          height: '400px',
          data: this.usuario
        });
      }
    });

    setTimeout(() => {
      this.mostrarBotonAsistencia = false;
    }, 2000);
  }
}
