import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuscarComponent } from '../buscar/buscar.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/_service/menu.service';
import { Menu } from 'src/app/_model/menu';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  title = 'SistemaHospital-Frontend';
  usuario: string;

  menus: Menu[];

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService,
    private loginService: LoginService
  ) { };

  ngOnInit():void{
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;

    this.menuService.listarPorUsuario(this.usuario).subscribe(data => {
      this.menus = data;
    })
  }


  openDialog() {
    this.dialog.open(BuscarComponent, {
      width: '100%',
      height: '95%'
    });
  }

  cerrarSesion(){
    this.loginService.cerrarSesion();
  }
}
