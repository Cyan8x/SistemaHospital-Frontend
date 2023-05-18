import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EstadoAtencion } from '../_model/estadoAtencion';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class EstadoAtencionService extends GenericService<EstadoAtencion> {
  private estadoAtencionCambio: Subject<EstadoAtencion[]> = new Subject<
    EstadoAtencion[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/estadoatencion`);
  }

  // private url: string = `${environment.HOST}/estadoatencion`;

  // constructor(private http: HttpClient) {}

  // listar() {
  //   return this.http.get<EstadoAtencion[]>(this.url);
  // }

  // listarPorId(id: number) {
  //   return this.http.get<EstadoAtencion>(`${this.url}/${id}`);
  // }

  // registrar(estado_atencion: EstadoAtencion) {
  //   return this.http.post(this.url, estado_atencion);
  // }

  // modificar(estado_atencion: EstadoAtencion) {
  //   return this.http.put(this.url, estado_atencion);
  // }

  // delete(id: number) {
  //   return this.http.delete(`${this.url}/${id}`);
  // }

  getEstadoAtencionCambio() {
    return this.estadoAtencionCambio.asObservable();
  }

  setEstadoAtencionCambio(estadoAtencion: EstadoAtencion[]) {
    this.estadoAtencionCambio.next(estadoAtencion);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
