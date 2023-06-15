import { Component, ViewChild, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asistencia } from 'src/app/_model/asistencia';
import { AsistenciaService } from 'src/app/_service/asistencia.service';
import * as moment from 'moment';
import { AsistenciaDialogComponent } from './asistencia-dialog/asistencia-dialog.component';
import { EliminarAsistenciaDialogComponent } from './eliminar-asistencia-dialog/eliminar-asistencia-dialog.component';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  dataSource: MatTableDataSource<Asistencia>;
  displayedColumns: string[] = [
    'index',
    'usuario',
    'fechaAsistencia',
    'fechaHoraAsistencia',
    'estadoAsistencia',
    'acciones'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private asistenciaService: AsistenciaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.asistenciaService.getAsistenciaCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.asistenciaService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.asistenciaService.listar().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Asistencia[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(asistencia?: Asistencia) {
    this.dialog.open(AsistenciaDialogComponent, {
      width: '400px',
      height: '250px',
      data: asistencia
    });
  }

  eliminar(asistencia: Asistencia) {
    this.dialog.open(EliminarAsistenciaDialogComponent, {
      width: '400px',
      height: '250px',
      data: asistencia
    });

    // this.pacienteService
    //   .delete(paciente.paciente_id)
    //   .pipe(
    //     switchMap(() => {
    //       return this.pacienteService.listar();
    //     })
    //   )
    //   .subscribe((data) => {
    //     this.pacienteService.setPacienteCambio(data);
    //     this.pacienteService.setMensajeCambio('Se eliminó.');
    //   });
  }
}
