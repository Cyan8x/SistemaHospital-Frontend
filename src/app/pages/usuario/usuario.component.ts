import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { Router } from '@angular/router';
import { ConfirmarEliminacionDialogComponent } from '../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  selectedRow: any;

  dataSource: MatTableDataSource<Usuario>;
  displayedColumns: string[] = [
    'usuario_id',
    'usuario',
    'nombreCompletoUsuario',
    'dniUsuario',
    'esActivoUsuario',
    'rol',
    'editar',
    'eliminar',
    'horario',
    'menus'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.usuarioService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.usuarioService.listar().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Usuario[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(usuario?: Usuario) {
    this.dialog.open(UsuarioDialogComponent, {
      width: '50%',
      height: '95%',
      data: usuario
    });
  }

  openConfirmacionEliminacionDialog(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el usuario: '${usuario.usuario}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService
          .delete(usuario.usuario_id)
          .pipe(
            switchMap(() => {
              return this.usuarioService.listar();
            })
          )
          .subscribe((data) => {
            this.usuarioService.setUsuarioCambio(data);
            this.usuarioService.setMensajeCambio('Se eliminó Usuario.');
          });

        this.router.navigate(['/pages/usuario'])
      }
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
  }
}
