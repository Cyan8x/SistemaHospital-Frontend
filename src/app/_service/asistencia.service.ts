import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Asistencia } from '../_model/asistencia';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SuccessMessage } from '../_model/succesMessageDto';
import { JustificacionTardanza } from '../_model/justificacionTardanza';

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

  asistenciasOfUsuario(usuario_id: number) {
    return this.http.get<Asistencia[]>(`${this.url}/usuario/${usuario_id}`);
  }

  cantidadAsistenciasPorEstado(usuario_id: number): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.url}/cantAsistUser/${usuario_id}`);
  }

  registrarAsistenciaConValidaciones(usuario_id: number) {
    return this.http.post<SuccessMessage>(`${this.url}/registrarConValid/${usuario_id}`, null);
  }

  justificarTardanza(justificacionTardanza: JustificacionTardanza) {
    return this.http.put<SuccessMessage>(`${this.url}/justificarTardanza`, justificacionTardanza);
  }

  //PDF
  generarReporteAsistenciaUsuario(usuario_id: number){
    return this.http.get(`${this.url}/genReportAsist/${usuario_id}`, {responseType: 'blob'});
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
