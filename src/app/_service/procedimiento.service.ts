import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Procedimiento } from '../_model/procedimiento';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService extends GenericService<Procedimiento>{

  private procedimientoCambio: Subject<Procedimiento[]> = new Subject<
    Procedimiento[]
  >();

  private procedimientoHoyCambio: Subject<Procedimiento[]> = new Subject<
    Procedimiento[]
  >();

  private procedimientoCompletadosCambio: Subject<Procedimiento[]> = new Subject<
    Procedimiento[]
  >();

  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedimiento`);
  }

  listarProcedimientosPendientesPorPaciente(paciente_id: number) {
    return this.http.get<Procedimiento[]>(`${this.url}/pendientesPorPaciente/${paciente_id}`);
  }

  listarProcedimientosPorPaciente(paciente_id: number) {
    return this.http.get<Procedimiento[]>(`${this.url}/porPaciente/${paciente_id}`);
  }

  listarProcedimientosTerminadosPorPaciente(paciente_id: number) {
    return this.http.get<Procedimiento[]>(`${this.url}/terminadosPorPaciente/${paciente_id}`);
  }

  selectProcedimientosPendientesPorUsuario(usuario_id: number) {
    return this.http.get<Procedimiento[]>(`${this.url}/pendientesPorUsuario/${usuario_id}`);
  }

  listarProcedimientosTerminadosPorUsuario(usuario_id: number) {
    return this.http.get<Procedimiento[]>(`${this.url}/terminadosPorUsuario/${usuario_id}`);
  }

  cantidadTerminadoPendientePorUsuario(usuario_id: number): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.url}/cantComplTermin/${usuario_id}`);
  }

  //PDF
  generarReporteProcedimientosPaciente(paciente_id: number){
    return this.http.get(`${this.url}/genReportProced/${paciente_id}`, {responseType: 'blob'});
  }

  getProcedimientoCambio() {
    return this.procedimientoCambio.asObservable();
  }

  setProcedimientoCambio(procedimientos: Procedimiento[]) {
    this.procedimientoCambio.next(procedimientos);
  }

  getProcedimientoHoyCambio() {
    return this.procedimientoHoyCambio.asObservable();
  }

  setProcedimientoHoyCambio(procedimientos: Procedimiento[]) {
    this.procedimientoHoyCambio.next(procedimientos);
  }

  getProcedimientoCompletadoCambio() {
    return this.procedimientoCompletadosCambio.asObservable();
  }

  setProcedimientoCompleatadoCambio(procedimientos: Procedimiento[]) {
    this.procedimientoCompletadosCambio.next(procedimientos);
  }
  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
