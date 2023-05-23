import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { EstadoAtencionComponent } from './pages/estadoAtencion/estadoAtencion.component';
import { EstadoAtencionEdicionComponent } from './pages/estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RolComponent } from './pages/rol/rol.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BuscarComponent } from './pages/buscar/buscar.component';

const routes: Routes = [
  { path: 'pages/paciente', component: PacienteComponent },
  { path: 'pages/inicio', component: InicioComponent },
  { path: 'pages/rol', component: RolComponent },
  { path: 'pages/usuario', component: UsuarioComponent },
  { path: 'pages/buscar', component: BuscarComponent },
  {
    path: 'pages/estadoAtencion',
    component: EstadoAtencionComponent,
    children: [
      { path: 'nuevo', component: EstadoAtencionEdicionComponent },
      { path: 'edicion/:id', component: EstadoAtencionEdicionComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
