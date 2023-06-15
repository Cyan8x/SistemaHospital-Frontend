import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente/paciente.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuxurldialogComponent } from './auxurldialog/auxurldialog.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { BuscarComponent } from './buscar/buscar.component';
import { EstadoAtencionComponent } from './estadoAtencion/estadoAtencion.component';
import { GuardService } from '../_service/guard.service';
import { Not403Component } from './not403/not403.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';

const routes: Routes = [
  { path: 'paciente', component: PacienteComponent, canActivate: [GuardService] },
  { path: 'asistencia', component: AsistenciaComponent, canActivate: [GuardService] },
  { path: 'inicio', component: InicioComponent, canActivate: [GuardService] },
  { path: 'paciente-userview/:id', component: AuxurldialogComponent, canActivate: [GuardService] },
  { path: 'rol', component: RolComponent, canActivate: [GuardService] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [GuardService] },
  { path: 'buscar', component: BuscarComponent, canActivate: [GuardService] },
  { path: 'estadoAtencion', component: EstadoAtencionComponent, canActivate: [GuardService] },
  { path: 'not-403', component: Not403Component }
  // {
  //   path: 'pages/estadoAtencion',
  //   component: EstadoAtencionComponent,
  //   children: [
  //     { path: 'nuevo', component: EstadoAtencionEdicionComponent },
  //     { path: 'edicion/:id', component: EstadoAtencionEdicionComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
