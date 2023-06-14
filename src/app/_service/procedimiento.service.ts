import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Procedimiento } from '../_model/procedimiento';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService extends GenericService<Procedimiento>{

  private procedimientoCambio: Subject<Procedimiento[]> = new Subject<
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

  getProcedimientoCambio() {
    return this.procedimientoCambio.asObservable();
  }

  setProcedimientoCambio(procedimientos: Procedimiento[]) {
    this.procedimientoCambio.next(procedimientos);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
