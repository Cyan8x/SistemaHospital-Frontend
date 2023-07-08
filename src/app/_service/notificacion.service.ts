import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Notificacion } from '../_model/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService extends GenericService<Notificacion> {
  private notificacionCambio: Subject<Notificacion[]> = new Subject<
    Notificacion[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  private cantidadNotificacione = new Subject<number>();
  variable$ = this.cantidadNotificacione.asObservable();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/notificacion`);
  }

  setcantidadNotificacione(cant: number){
    this.cantidadNotificacione.next(cant);
  }

  cantidadaNotificacionesPorUsuario(usuario_id: number) {
    return this.http.get<number>(`${this.url}/cantidadNotif/${usuario_id}`);
  }

  selectNotificacionesPorUsuario(usuario_id: number) {
    return this.http.get<Notificacion[]>(`${this.url}/porUsuario/${usuario_id}`);
  }

  getNotificacionCambio() {
    return this.notificacionCambio.asObservable();
  }

  setNotificacionCambio(notificacion: Notificacion[]) {
    this.notificacionCambio.next(notificacion);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
