import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-usuario-menus',
  templateUrl: './usuario-menus.component.html',
  styleUrls: ['./usuario-menus.component.css']
})
export class UsuarioMenusComponent implements OnInit {
  menus: Menu[];
  menusUsuario: Menu[] = [];
  usuario_id: number;

  constructor(private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private dialog: MatDialog,
    private router: Router) {

  }

  ngOnInit(): void {
    this.menuService.listar().subscribe(data => {
      this.menus = data
    });

    this.route.params.subscribe(data => {
      this.usuario_id = data['id'];
      this.usuarioService.listarPorId(this.usuario_id).subscribe(data => {
        this.menuService.listarPorUsuario(data.usuario).subscribe(data => {
          this.menusUsuario = data;
        });
      });
    });
  }

  menuSeleccionado(menu: Menu): boolean {
    // Verifica si el menú está en la lista de menús a los que el usuario tiene acceso
    return this.menusUsuario.some((menuUsuario: Menu) => menuUsuario.menu_id === menu.menu_id);
  }

  toggleSeleccion(menu: Menu): void {
    const index = this.menusUsuario.findIndex((menuUsuario: Menu) => menuUsuario.menu_id === menu.menu_id);
    if (index > -1) {
      this.menusUsuario.splice(index, 1);  // Desmarcar el menú si ya estaba seleccionado
    } else {
      this.menusUsuario.push(menu);  // Marcar el menú si no estaba seleccionado
    }
  }

  operar() {
    this.menuService.asignarMenusUsuario(this.usuario_id, this.menusUsuario).subscribe(data => {
      this.usuarioService.successMessageDialog("Se asignaron correctamente los menus al usuario.", this.dialog);
    });
    this.router.navigate(['/pages/usuario']);
  }

}
