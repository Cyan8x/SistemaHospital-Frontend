import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EstadoAtencion } from '../_model/estadoAtencion';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoAtencionService {
  estadoAtencionCambio: Subject<EstadoAtencion[]> = new Subject<EstadoAtencion[]>();
  mensajeCambio: Subject<string> = new Subject<string>();
  private url: string = `${environment.HOST}/estadoatencion`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<EstadoAtencion[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<EstadoAtencion>(`${this.url}/${id}`);
  }

  registrar(estado_atencion: EstadoAtencion) {
    return this.http.post(this.url, estado_atencion);
  }

  modificar(estado_atencion: EstadoAtencion) {
    return this.http.put(this.url, estado_atencion);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
