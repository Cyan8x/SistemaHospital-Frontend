import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../_model/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = 'http://localhost:9090/oauth/token'

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  login(usuario: string, contrasena: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    if (token == null) {
      sessionStorage.clear();
      this.router.navigate(['login']);
    } else {
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    }
  }
}
