import { NgModule, LOCALE_ID } from '@angular/core';
import { PacienteComponent } from './paciente/paciente.component';
import { EstadoAtencionComponent } from './estadoAtencion/estadoAtencion.component';
import { EstadoAtencionEdicionComponent } from './estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';
import { PacienteDialogComponent } from './paciente/paciente-dialog/paciente-dialog.component';
import { InicioComponent } from './inicio/inicio.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioDialogComponent } from './usuario/usuario-dialog/usuario-dialog.component';
import { BuscarComponent } from './buscar/buscar.component';
import { PacienteDialogUserviewComponent } from './paciente-dialog-userview/paciente-dialog-userview.component';
import { ProcedimientoDialogComponent } from './paciente-dialog-userview/procedimiento-dialog/procedimiento-dialog.component';
import { ComentarioDialogComponent } from './paciente-dialog-userview/comentario-dialog/comentario-dialog.component';
import { AuxurldialogComponent } from './auxurldialog/auxurldialog.component';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { AsistenciaDialogComponent } from './asistencia/asistencia-dialog/asistencia-dialog.component';
import { TardanzaDialogComponent } from './layout/tardanza-dialog/tardanza-dialog.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { UsuarioHorarioComponent } from './usuario/usuario-horario/usuario-horario.component';
import { UsuarioMenusComponent } from './usuario/usuario-menus/usuario-menus.component';
import { ConfirmarEliminacionDialogComponent } from './confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioComponent } from './inicio/calendario/calendario.component';
import { MitrabajoComponent } from './inicio/mitrabajo/mitrabajo.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AsistenciaUsuarioComponent } from './asistencia/asistencia-usuario/asistencia-usuario.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { VerReporteComponent } from './asistencia/ver-reporte/ver-reporte.component';
import { VerReporteProcedimientosComponent } from './paciente-dialog-userview/ver-reporte-procedimientos/ver-reporte-procedimientos.component';
import { ErrorsDialogComponent } from './errors-dialog/errors-dialog.component';

@NgModule({
  declarations: [
    PacienteComponent,
    EstadoAtencionComponent,
    EstadoAtencionEdicionComponent,
    PacienteDialogComponent,
    InicioComponent,
    UsuarioComponent,
    UsuarioDialogComponent,
    BuscarComponent,
    PacienteDialogUserviewComponent,
    ProcedimientoDialogComponent,
    ComentarioDialogComponent,
    AuxurldialogComponent,
    LayoutComponent,
    Not403Component,
    Not404Component,
    AsistenciaComponent,
    AsistenciaDialogComponent,
    TardanzaDialogComponent,
    NotificacionComponent,
    UsuarioHorarioComponent,
    UsuarioMenusComponent,
    ConfirmarEliminacionDialogComponent,
    CalendarioComponent,
    MitrabajoComponent,
    AsistenciaUsuarioComponent,
    VerReporteComponent,
    VerReporteProcedimientosComponent,
    ErrorsDialogComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PagesRoutingModule,
    FullCalendarModule,
    NgApexchartsModule,
    PdfViewerModule
  ],
  providers: []
})
export class PagesModule { }
