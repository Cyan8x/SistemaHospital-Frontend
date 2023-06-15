import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/_model/usuario';
import { LoginService } from 'src/app/_service/login.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // SessionStorage => tiene menor alcance que el LocalStorage, ya que si se cierra el navegador o la pestaña, se cierra la sesion
  // LocalStorage => tiene mayor alcance que el SessionStorage, ya que si se cierra el navegador, la pestaña o se apaga la computadora, la sesion aun permanece

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/inicio']);
    });
  }

  // ngAfterViewInit() {
  //   (window as any).initialize();
  // }

}
