import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Asistencia } from 'src/app/_model/asistencia';
import { AsistenciaService } from 'src/app/_service/asistencia.service';
import { AsistenciaDialogComponent } from '../asistencia-dialog/asistencia-dialog.component';
import { ConfirmarEliminacionDialogComponent } from '../../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { VerReporteComponent } from '../ver-reporte/ver-reporte.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-asistencia-usuario',
  templateUrl: './asistencia-usuario.component.html',
  styleUrls: ['./asistencia-usuario.component.css']
})
export class AsistenciaUsuarioComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  usuario_id: number;

  contadorAsistenciasPorEstadoUsuario: Map<string, number> = new Map();
  seriesAsistenciasCant: number[] = [];
  labelsAsistenciaName: string[] = [];

  dataSource: MatTableDataSource<Asistencia>;
  displayedColumns: string[] = [
    'index',
    'usuario',
    'fechaAsistencia',
    'fechaHoraAsistencia',
    'estadoAsistencia',
    'editar',
    'eliminar'
  ];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private asistenciaService: AsistenciaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
    this.chartOptions = {
      series: this.seriesAsistenciasCant,
      chart: {
        width: 500,
        type: "pie"
      },
      labels: this.labelsAsistenciaName,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.usuario_id = data["id"];

      this.asistenciaService.getAsistenciaCambio().subscribe((data) => {
        this.crearTabla(data);
      });

      this.asistenciaService.getMensajeCambio().subscribe((data) => {
        this.snackBar.open(data, 'AVISO', { duration: 2000 });
      });

      this.asistenciaService.asistenciasOfUsuario(this.usuario_id).subscribe((data) => {
        this.crearTabla(data);
      });


    });


  }

  definirGrafico() {
    this.asistenciaService.cantidadAsistenciasPorEstado(this.usuario_id).subscribe(data => {
      if (data != null) {
        for (const clave in data) {
          if (data.hasOwnProperty(clave)) {
            const valor = data[clave];
            this.seriesAsistenciasCant.push(valor);
            this.labelsAsistenciaName.push(clave);
          }
        }
        this.chartOptions = {
          series: this.seriesAsistenciasCant,
          chart: {
            width: 500,
            type: "pie"
          },
          labels: this.labelsAsistenciaName,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.seriesAsistenciasCant = [];
        this.labelsAsistenciaName = [];
      }
    });
  }
  
  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Asistencia[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.definirGrafico();
  }

  openDialog(asistencia?: Asistencia) {
    this.dialog.open(AsistenciaDialogComponent, {
      width: '400px',
      height: '250px',
      data: asistencia
    });
  }

  openConfirmacionEliminacionDialog(asistencia: Asistencia): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: '¿Estás seguro de eliminar la asistencia?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.asistenciaService
          .delete(asistencia.asistencia_id)
          .pipe(
            switchMap(() => {
              return this.asistenciaService.asistenciasOfUsuario(this.usuario_id);
            })
          )
          .subscribe((data) => {
            this.asistenciaService.setAsistenciaCambio(data);
            this.asistenciaService.setMensajeCambio('Se eliminó la asistencia seleccionada.');
            this.definirGrafico();
          });
      }
    });
  }

  verReporteEnDialog(){
    this.dialog.open(VerReporteComponent, {
      width: '800px',
      height: '800px',
      data: this.usuario_id
    });
  }
}
