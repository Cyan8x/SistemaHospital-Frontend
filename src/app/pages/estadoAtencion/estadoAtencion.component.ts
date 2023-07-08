import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';
import { EstadoAtencionEdicionComponent } from './estadoAtencion-edicion/estadoAtencion-edicion.component';
import { ConfirmarEliminacionDialogComponent } from '../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';

@Component({
  selector: 'app-estadoAtencion',
  templateUrl: './estadoAtencion.component.html',
  styleUrls: ['./estadoAtencion.component.css'],
})
export class EstadoAtencionComponent implements OnInit {
  dataSource: MatTableDataSource<EstadoAtencion>;
  displayedColumns: string[] = [
    'estado_atencion_id',
    'nombreEstadoAtencion',
    'editar',
    'eliminar'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private estadoAtencionService: EstadoAtencionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.estadoAtencionService.getEstadoAtencionCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.estadoAtencionService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.estadoAtencionService.listar().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  crearTabla(data: EstadoAtencion[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
    /*this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
      return data.nombres.toLowerCase().includes(filter) || data.apellidos.toLowerCase().includes(filter);
    }})*/
  }

  openDialog(estadoAtencion?: EstadoAtencion) {
    this.dialog.open(EstadoAtencionEdicionComponent, {
      width: '400px',
      data: estadoAtencion
    });
  }

  openConfirmacionEliminacionDialog(estadoAtencion: EstadoAtencion): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el estado de atencion: '${estadoAtencion.nombreEstadoAtencion}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estadoAtencionService
          .delete(estadoAtencion.estado_atencion_id)
          .pipe(
            switchMap(() => {
              return this.estadoAtencionService.listar();
            })
          )
          .subscribe((data) => {
            this.estadoAtencionService.setEstadoAtencionCambio(data);
            this.estadoAtencionService.setMensajeCambio('Se eliminó el estado de atencion seleccionado.');
          });
      }
    });
  }
}
