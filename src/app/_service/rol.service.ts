import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Rol } from '../_model/rol';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  private rolCambio: Subject<Rol[]> = new Subject<
    Rol[]
  >();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/rol`);
  }

  getRolCambio() {
    return this.rolCambio.asObservable();
  }

  setRolCambio(roles: Rol[]) {
    this.rolCambio.next(roles);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
