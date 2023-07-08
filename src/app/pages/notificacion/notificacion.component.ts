import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs';
import { Notificacion } from 'src/app/_model/notificacion';
import { Usuario } from 'src/app/_model/usuario';
import { NotificacionService } from 'src/app/_service/notificacion.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

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
      }
      );

      this.notificacionService.getNotificacionCambio().subscribe((data) => {
    this.notificaciones = data;
    });
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

  redireccionarConParametros(paciente_id: number) {
    const currentRoute: NavigationExtras = {
      state: {
        urlAnterior: this.router.url
      }
    };
    this.router.navigate(['/pages/paciente-userview', paciente_id], currentRoute);
  }
}
