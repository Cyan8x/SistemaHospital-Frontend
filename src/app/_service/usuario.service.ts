import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../_model/usuario';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario> {

  private usuarioCambio: Subject<Usuario[]> = new Subject<
  Usuario[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/usuarios`);
  }

  getUsuarioCambio() {
    return this.usuarioCambio.asObservable();
  }

  setUsuarioCambio(usuarios: Usuario[]) {
    this.usuarioCambio.next(usuarios);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
