import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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


  usuarioLogueado: string;
  user: Usuario;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  // SessionStorage => tiene menor alcance que el LocalStorage, ya que si se cierra el navegador o la pestaña, se cierra la sesion
  // LocalStorage => tiene mayor alcance que el SessionStorage, ya que si se cierra el navegador, la pestaña o se apaga la computadora, la sesion aun permanece

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      const decodedToken = helper.decodeToken(token);
      this.usuarioLogueado = decodedToken.user_name;

      this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(
        data => {
          this.user = data;
          this.usuarioService.setUsuarioLogueado(this.user);
        }
      );
      this.router.navigate(['/pages/inicio']);
    });
  }

  // ngAfterViewInit() {
  //   (window as any).initialize();
  // }

}
