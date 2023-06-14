import { Injectable } from '@angular/core';
import { Comentario } from '../_model/comentario';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService extends GenericService<Comentario> {

  private comentarioCambio: Subject<Comentario[]> = new Subject<
    Comentario[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/comentario`);
  }

  listarComentariosPorPaciente(paciente_id: number) {
    return this.http.get<Comentario[]>(`${this.url}/porPaciente/${paciente_id}`);
  }

  getComentarioCambio() {
    return this.comentarioCambio.asObservable();
  }

  setComentarioCambio(comentario: Comentario[]) {
    this.comentarioCambio.next(comentario);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
