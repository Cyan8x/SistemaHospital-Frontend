import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../_model/menu';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SuccessMessage } from '../_model/succesMessageDto';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu>{

  private menuCambio: Subject<Menu[]> = new Subject<
    Menu[]
  >();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/menu`);
  }

  listarPorUsuario(usuario: string) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.post<Menu[]>(`${this.url}/${usuario}`,usuario,{
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  asignarMenusUsuario(usuario_id: number, menus: Menu[]) {
    return this.http.post<SuccessMessage>(`${this.url}/agregarMenus/${usuario_id}`, menus);
  }

  getMenuCambio() {
    return this.menuCambio.asObservable();
  }

  setMenuCambio(menu: Menu[]) {
    this.menuCambio.next(menu);
  }
}
