import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { RolDialogComponent } from './rol-dialog/rol-dialog.component';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent {
  dataSource: MatTableDataSource<Rol>;
  displayedColumns: string[] = [
    'rol_id',
    'nombreRol',
    'descripcionRol',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private rolService: RolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.rolService.getRolCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.rolService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.rolService.listar().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  crearTabla(data: Rol[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  openDialog(rol?: Rol) {
    this.dialog.open(RolDialogComponent, {
      width: '400px',
      data: rol
    });
  }

  eliminar(rol: Rol) {

    //FORMA IDEAL
    this.rolService.delete(rol.rol_id).pipe(switchMap(() => {
      return this.rolService.listar();
    }))
      .subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('Se eliminó.');
      });
  }
}
