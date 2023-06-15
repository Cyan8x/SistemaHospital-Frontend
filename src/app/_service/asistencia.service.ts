import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Asistencia } from '../_model/asistencia';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SuccessMessage } from '../_model/succesMessageDto';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService extends GenericService<Asistencia>{

  private asistenciaCambio: Subject<Asistencia[]> = new Subject<
    Asistencia[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/asistencia`);
  }

  verificarAsistenciaUsuarioHoy(usuario_id: number) {
    return this.http.get<SuccessMessage>(`${this.url}/verificar/${usuario_id}`);
  }

  registrarAsistenciaConValidaciones(usuario_id: number) {
    return this.http.post(`${this.url}/registrarConValid/${usuario_id}`, null);
  }

  getAsistenciaCambio() {
    return this.asistenciaCambio.asObservable();
  }

  setAsistenciaCambio(asistencia: Asistencia[]) {
    this.asistenciaCambio.next(asistencia);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
