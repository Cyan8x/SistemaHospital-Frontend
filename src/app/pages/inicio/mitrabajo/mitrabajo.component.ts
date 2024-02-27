import { Component, OnInit, ViewChild } from '@angular/core';
import { Notificacion } from 'src/app/_model/notificacion';
import { Procedimiento } from 'src/app/_model/procedimiento';
import * as moment from 'moment';
import { switchMap } from 'rxjs';
import { NotificacionService } from 'src/app/_service/notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import { ConfirmarEliminacionDialogComponent } from '../../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormatDateService } from 'src/app/_service/format-date.service';
import { ProcedimientoDialogComponent } from '../../paciente-dialog-userview/procedimiento-dialog/procedimiento-dialog.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-mitrabajo',
  templateUrl: './mitrabajo.component.html',
  styleUrls: ['./mitrabajo.component.css']
})
export class MitrabajoComponent implements OnInit {

  usuario_id: number;
  usuario: Usuario;

  procedimientosHoy: Procedimiento[];
  vacioProcedimientoHoy: boolean;
  procedimientosCompletados: Procedimiento[];
  vacioProcedimientosCompletados: boolean;

  esconderGrafico: boolean = false;

  seriesProcedimientoCant: number[] = [];
  labelsProcedimientoName: string[] = [];

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private procedimientoService: ProcedimientoService,
    private notificacionService: NotificacionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    public formatDate: FormatDateService) {
    this.chartOptions = {
      series: this.seriesProcedimientoCant,
      chart: {
        width: 450,
        type: "pie"
      },
      labels: this.labelsProcedimientoName,
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
      this.usuario_id = data['id'];
      this.procedimientoService.verificarCantProcedimientos(this.usuario_id).subscribe(result => {
        this.esconderGrafico = result;
      });
      this.verificarProcedimientosTerminados(this.usuario_id);
      this.verificarProcedimientosPendientes(this.usuario_id);

      this.usuarioService.listarPorId(this.usuario_id).subscribe(
        data => {
          this.usuario = data;

          this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuarioService.getUsuarioLogueado().usuario_id).subscribe((data) => {
            this.procedimientosHoy = data;
          })

          this.procedimientoService.listarProcedimientosTerminadosPorUsuario(this.usuarioService.getUsuarioLogueado().usuario_id).subscribe((data) => {
            this.procedimientosCompletados = data;
          })

          this.definirGrafico(this.usuario.usuario_id);
        }
      );

      this.procedimientoService.getProcedimientoHoyCambio().subscribe(data => {
        this.procedimientosHoy = data;
      });

      this.procedimientoService.getProcedimientoCompletadoCambio().subscribe(data => {
        this.procedimientosCompletados = data;
      });
    });
  }

  verificarProcedimientosTerminados(usuario_id: number) {
    this.procedimientoService.listarProcedimientosTerminadosPorUsuario(usuario_id).subscribe(data => {
      if (data.length > 0) {
        this.vacioProcedimientosCompletados = false;
      } else {
        this.vacioProcedimientosCompletados = true;
      }
    });
  }

  verificarProcedimientosPendientes(usuario_id: number) {
    this.procedimientoService.selectProcedimientosPendientesPorUsuario(usuario_id).subscribe(data => {
      if (data.length > 0) {
        this.vacioProcedimientoHoy = false
      } else {
        this.vacioProcedimientoHoy = true;
      }
    });
  }

  definirGrafico(usuario_id: number) {
    this.procedimientoService.cantidadTerminadoPendientePorUsuario(usuario_id).subscribe(data => {
      if (data != null) {
        for (const clave in data) {
          if (data.hasOwnProperty(clave)) {
            const valor = data[clave];
            this.seriesProcedimientoCant.push(valor);
            this.labelsProcedimientoName.push(clave);
          }
        }
        this.chartOptions = {
          series: this.seriesProcedimientoCant,
          chart: {
            width: 450,
            type: "pie"
          },
          labels: this.labelsProcedimientoName,
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
        this.seriesProcedimientoCant = [];
        this.labelsProcedimientoName = [];
      }
    });
  }

  openDialogProcedimiento(procedimiento?: Procedimiento) {
    let dialogRef = this.dialog.open(ProcedimientoDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        procedimiento: procedimiento,
        paciente: procedimiento.paciente
      }
    });

    dialogRef.afterClosed().subscribe(()=>{
      this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuario.usuario_id).subscribe((data) => {
        this.procedimientosHoy = data;
      })

      this.procedimientoService.listarProcedimientosTerminadosPorUsuario(this.usuario.usuario_id).subscribe((data) => {
        this.procedimientosCompletados = data;
      })
      this.definirGrafico(this.usuario.usuario_id);
    });
  }

  prepararNotificacion(procedimiento: Procedimiento) {
    let notificacion = new Notificacion();
    notificacion.fechaHoraNotificacion = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    notificacion.procedimiento = procedimiento;
    notificacion.usuarioOrigen = this.usuario;
    notificacion.usuarioDestino = procedimiento.paciente.usuario.usuario_id;
    if (procedimiento.es_terminado) {
      procedimiento.es_terminado = false;
      notificacion.causa = "Se volvió a abrir un procedimiento";
    } else {
      procedimiento.es_terminado = true;
      notificacion.causa = "Se volvió a abrir un procedimiento";
    }
    return notificacion;
  }

  procedimientoTerminadoDeHoy(procedimiento: Procedimiento) {
    let notificacion = new Notificacion();
    notificacion = this.prepararNotificacion(procedimiento);
    this.procedimientoService
      .modificar(procedimiento)
      .pipe(
        switchMap(() => {
          return this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuario.usuario_id)
        })
      )
      .subscribe((data) => {
        this.procedimientoService.setProcedimientoHoyCambio(data);
        this.procedimientoService.setMensajeCambio('Se modificó.');

        this.procedimientoService.listarProcedimientosTerminadosPorUsuario(this.usuario.usuario_id).subscribe((data) => {
          this.procedimientosCompletados = data;
          // this.agregarElementosAlTree();
        })

        if (procedimiento.paciente.usuario.usuario_id != this.usuario.usuario_id) {
          this.notificacionService.registrar(notificacion).subscribe(data => {
          });
        }
        this.definirGrafico(this.usuario.usuario_id);
        this.procedimientoService.verificarCantProcedimientos(this.usuario_id).subscribe(result => {
          this.esconderGrafico = result;
        });
        this.verificarProcedimientosTerminados(this.usuario_id);
        this.verificarProcedimientosPendientes(this.usuario_id);
      });
  }

  procedimientoTerminadoDeCompletados(procedimiento: Procedimiento) {
    let notificacion = new Notificacion();
    notificacion = this.prepararNotificacion(procedimiento);
    this.procedimientoService
      .modificar(procedimiento)
      .pipe(
        switchMap(() => {
          return this.procedimientoService.listarProcedimientosTerminadosPorUsuario(this.usuario.usuario_id)
        })
      )
      .subscribe((data) => {
        this.procedimientoService.setProcedimientoCompleatadoCambio(data);
        this.procedimientoService.setMensajeCambio('Se modificó.');

        this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuario.usuario_id).subscribe((data) => {
          this.procedimientosHoy = data;
          // this.agregarElementosAlTree();
        })

        if (procedimiento.paciente.usuario.usuario_id != this.usuario.usuario_id) {
          this.notificacionService.registrar(notificacion).subscribe(data => {
          });
        }
        this.definirGrafico(this.usuario.usuario_id);
        this.procedimientoService.verificarCantProcedimientos(this.usuario_id).subscribe(result => {
          this.esconderGrafico = result;
        });
        this.verificarProcedimientosTerminados(this.usuario_id);
        this.verificarProcedimientosPendientes(this.usuario_id);
      });
  }

  openConfirmacionEliminacionDialog(procedimiento: Procedimiento): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el procedimiento?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let notificacion = new Notificacion();
        notificacion.fechaHoraNotificacion = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
        notificacion.procedimiento = procedimiento;
        notificacion.usuarioOrigen = this.usuario;
        notificacion.usuarioDestino = procedimiento.paciente.usuario.usuario_id;
        notificacion.causa = "Se eliminó un procedimiento";

        this.procedimientoService.delete(procedimiento.procedimiento_id).pipe(switchMap(() => {
          if (procedimiento.es_terminado) {
            return this.procedimientoService.listarProcedimientosTerminadosPorUsuario(this.usuario.usuario_id);
          } else {
            return this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuario.usuario_id)
          }
        }))
          .subscribe(data => {
            if (procedimiento.es_terminado) {
              this.procedimientoService.setProcedimientoCompleatadoCambio(data);
            } else {
              this.procedimientoService.setProcedimientoHoyCambio(data);
            }
            this.procedimientoService.setMensajeCambio('Se eliminó.');

            if (procedimiento.paciente.usuario.usuario_id != this.usuario.usuario_id) {
              this.notificacionService.registrar(notificacion).subscribe(data => {
              });
            }

            this.definirGrafico(this.usuario.usuario_id);
            this.procedimientoService.verificarCantProcedimientos(this.usuario_id).subscribe(result => {
              this.esconderGrafico = result;
            });
            this.verificarProcedimientosTerminados(this.usuario_id);
            this.verificarProcedimientosPendientes(this.usuario_id);
          });
      }
    });
  }

}
