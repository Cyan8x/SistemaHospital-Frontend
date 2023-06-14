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
import { Asistencia } from 'src/app/_model/asistencia';
import * as moment from 'moment';
import { EstadoAsistencia } from 'src/app/_model/EstadoAsistencia';

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

  menus: Menu[];

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService,
    private loginService: LoginService,
    private asistenciaService: AsistenciaService,
    private usuarioService: UsuarioService
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
      }
    );

    this.menuService.listarPorUsuario(this.usuario.usuario).subscribe(data => {
      this.menus = data;
    })
  }


  openDialog() {
    this.dialog.open(BuscarComponent, {
      width: '100%',
      height: '95%'
    });
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

  asistencia() {
    let estadoAsistencia = new EstadoAsistencia()
    estadoAsistencia.estado_asistencia_id = 1;

    let asistencia = new Asistencia();
    asistencia.usuario = this.usuarioService.getUsuarioLogueado();
    asistencia.fechaHoraAsistencia = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    asistencia.justificacionTardanza = null;
    asistencia.estadoAsistencia = estadoAsistencia;

    this.asistenciaService.registrar(asistencia).subscribe(data=>{
      console.log(data);
    });
  }
}
