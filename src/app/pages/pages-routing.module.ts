import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente/paciente.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuxurldialogComponent } from './auxurldialog/auxurldialog.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { BuscarComponent } from './buscar/buscar.component';
import { EstadoAtencionComponent } from './estadoAtencion/estadoAtencion.component';
import { GuardService } from '../_service/guard.service';
import { Not403Component } from './not403/not403.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { UsuarioHorarioComponent } from './usuario/usuario-horario/usuario-horario.component';
import { UsuarioMenusComponent } from './usuario/usuario-menus/usuario-menus.component';
import { CalendarioComponent } from './inicio/calendario/calendario.component';
import { MitrabajoComponent } from './inicio/mitrabajo/mitrabajo.component';
import { AsistenciaUsuarioComponent } from './asistencia/asistencia-usuario/asistencia-usuario.component';

const routes: Routes = [
  { path: 'paciente', component: PacienteComponent, canActivate: [GuardService] },
  {
    path: 'asistencia', component: AsistenciaComponent, children: [
      { path: "usuario/:id", component: AsistenciaUsuarioComponent }
    ], canActivate: [GuardService]
  },
  {
    path: 'inicio', component: InicioComponent,
    children: [
      { path: "calendario/:id", component: CalendarioComponent },
      { path: "mitrabajo/:id", component: MitrabajoComponent }
    ],
    canActivate: [GuardService]
  },
  { path: 'paciente-userview/:id', component: AuxurldialogComponent, canActivate: [GuardService] },
  { path: 'notificacion', component: NotificacionComponent, canActivate: [GuardService] },
  {
    path: 'usuario', component: UsuarioComponent,
    children: [
      { path: "horario/:id", component: UsuarioHorarioComponent },
      { path: "menus/:id", component: UsuarioMenusComponent }
    ]
    , canActivate: [GuardService]
  },
  { path: 'estadoAtencion', component: EstadoAtencionComponent, canActivate: [GuardService] },
  { path: 'not-403', component: Not403Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
