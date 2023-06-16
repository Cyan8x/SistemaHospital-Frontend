import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Paciente } from '../_model/paciente';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente>{

  private pacienteCambio: Subject<Paciente[]> = new Subject<
    Paciente[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/paciente`);
  }

  selectFavoritosPorUsuario(usuario_id: number) {
    return this.http.get<Paciente[]>(`${this.url}/favoritos/${usuario_id}`);
  }

  insertFavoritoPorUsuario(usuario_id: number, paciente_id: number) {
    return this.http.post(`${this.url}/insertFavoritos/${usuario_id}/${paciente_id}`, null);
  }

  deleteFavoritoPorUsuario(usuario_id: number, paciente_id: number) {
    return this.http.delete(`${this.url}/deleteFavoritos/${usuario_id}/${paciente_id}`);
  }

  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(pacientes: Paciente[]) {
    this.pacienteCambio.next(pacientes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
