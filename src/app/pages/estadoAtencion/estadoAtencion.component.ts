import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';

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
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private estadoAtencionService: EstadoAtencionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.estadoAtencionService.estadoAtencionCambio.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.estadoAtencionService.mensajeCambio.subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.estadoAtencionService.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
    /*this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
      return data.nombres.toLowerCase().includes(filter) || data.apellidos.toLowerCase().includes(filter);
    }})*/
  }
}
