import { NgModule } from '@angular/core';
import { PacienteComponent } from './paciente/paciente.component';
import { EstadoAtencionComponent } from './estadoAtencion/estadoAtencion.component';
import { EstadoAtencionEdicionComponent } from './estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';
import { PacienteDialogComponent } from './paciente/paciente-dialog/paciente-dialog.component';
import { InicioComponent } from './inicio/inicio.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { RolDialogComponent } from './rol/rol-dialog/rol-dialog.component';
import { UsuarioDialogComponent } from './usuario/usuario-dialog/usuario-dialog.component';
import { BuscarComponent } from './buscar/buscar.component';
import { PacienteDialogUserviewComponent } from './paciente-dialog-userview/paciente-dialog-userview.component';
import { ProcedimientoDialogComponent } from './paciente-dialog-userview/procedimiento-dialog/procedimiento-dialog.component';
import { ComentarioDialogComponent } from './paciente-dialog-userview/comentario-dialog/comentario-dialog.component';
import { AuxurldialogComponent } from './auxurldialog/auxurldialog.component';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { AsistenciaDialogComponent } from './asistencia/asistencia-dialog/asistencia-dialog.component';
import { EliminarAsistenciaDialogComponent } from './asistencia/eliminar-asistencia-dialog/eliminar-asistencia-dialog.component';

@NgModule({
  declarations: [
    PacienteComponent,
    EstadoAtencionComponent,
    EstadoAtencionEdicionComponent,
    PacienteDialogComponent,
    InicioComponent,
    RolComponent,
    UsuarioComponent,
    RolDialogComponent,
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
    EliminarAsistenciaDialogComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PagesRoutingModule
  ],
  providers: []
})
export class PagesModule { }
