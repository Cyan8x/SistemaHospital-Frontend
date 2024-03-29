import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import esLocale from '@fullcalendar/core/locales/es';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { ActivatedRoute } from '@angular/router';

import {
  ChartComponent
} from "ng-apexcharts";
import { ChartOptions } from '../mitrabajo/mitrabajo.component';
import { ProcedimientoDialogComponent } from '../../paciente-dialog-userview/procedimiento-dialog/procedimiento-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendarOptions?: CalendarOptions;
  eventsModel: any;

  usuario_id: number;

  esconderGrafico: boolean = false;

  seriesProcedimientoCant: number[] = [];
  labelsProcedimientoName: string[] = [];

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  constructor(private procedimientoService: ProcedimientoService,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
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

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.usuario_id = data['id'];
      this.procedimientoService.verificarCantProcedimientos(this.usuario_id).subscribe(result => {
        this.esconderGrafico = result;
      });
      this.definirCalendario();
    });
  }

  definirCalendario() {
    this.procedimientoService.selectProcedimientosPendientesPorUsuario(this.usuario_id).subscribe(data => {
      this.definirGrafico(this.usuario_id);

      const eventos = data.map((procedimiento: Procedimiento) => {
        return {
          id: procedimiento.procedimiento_id.toString(),
          title: procedimiento.procedimiento,
          start: procedimiento.fechaHoraInicio,
          end: procedimiento.fechaHoraFin
        };
      });
      // need for load calendar bundle first
      forwardRef(() => Calendar);

      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
        themeSystem: 'bootstrap5',
        locale: esLocale,
        customButtons: {
          myCustomButton: {
            text: 'custom!',
            click: function () {
              alert('clicked the custom button!');
            }
          }
        },
        titleFormat: { // will produce something like "Tuesday, September 18, 2018"
          month: 'long',
          year: 'numeric',
          day: 'numeric'
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay timeGridWeek dayGridMonth listWeek'
        },
        events: eventos,
        eventTimeFormat: { // like '14:30:00'
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          meridiem: false
        },
        displayEventTime: true,
        displayEventEnd: true,
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.handleEventClick.bind(this),
      };
    });
  }

  handleDateClick(arg: DateClickArg) {
    // console.log(arg.date);
  }

  handleEventClick(arg: EventClickArg) {
    this.procedimientoService.listarPorId(parseInt(arg.event._def.publicId)).subscribe(data => {
      this.openDialogProcedimiento(data);
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

    dialogRef.afterClosed().subscribe(() => {

      this.definirCalendario();
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

  updateHeader() {
    this.calendarOptions!.headerToolbar = {
      left: 'prev,next myCustomButton',
      center: 'title',
      right: ''
    };
  }

  updateEvents() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

    this.calendarOptions!.events = [{
      title: 'Updated Event',
      start: yearMonth + '-08',
      end: yearMonth + '-10'
    }];
  }

}
