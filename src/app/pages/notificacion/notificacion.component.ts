import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs';
import { Notificacion } from 'src/app/_model/notificacion';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { Usuario } from 'src/app/_model/usuario';
import { NotificacionService } from 'src/app/_service/notificacion.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import { ProcedimientoDialogComponent } from '../paciente-dialog-userview/procedimiento-dialog/procedimiento-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormatDateService } from 'src/app/_service/format-date.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {

  notificaciones: Notificacion[];

  usuarioLogueado: string;
  usuario: Usuario;

  constructor(
    private notificacionService: NotificacionService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    public formatDateService: FormatDateService,
    private router: Router
  ) {
  }



  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;
    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(
      data => {
        this.usuario = data;
        this.notificacionService.selectNotificacionesPorUsuario(this.usuario.usuario_id).subscribe(data => {
          this.notificaciones = data;
        });

        this.notificacionService.getNotificacionCambio().subscribe((data) => {
          this.notificaciones = data;
        });
      }
    );


  }

  marcarNotificacionVisto(notificacion: Notificacion) {
    this.notificacionService.delete(notificacion.notificacion_id).pipe(switchMap(() => {
      return this.notificacionService.selectNotificacionesPorUsuario(this.usuario.usuario_id);
    }))
      .subscribe(data => {
        this.notificacionService.setNotificacionCambio(data);
        this.notificacionService.setMensajeCambio('Se marcó como visto.');
        this.notificacionService.cantidadaNotificacionesPorUsuario(this.usuario.usuario_id).subscribe(data => {
          if (data > 0) {
            this.notificacionService.setcantidadNotificacione(data);
          } else {
            this.notificacionService.setcantidadNotificacione(null)
          }
        });
      });
  }

  openDialogProcedimiento(procedimiento?: Procedimiento) {
    this.dialog.open(ProcedimientoDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        procedimiento: procedimiento,
        paciente: procedimiento.paciente
      }
    });
  }
}
