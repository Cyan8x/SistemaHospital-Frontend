import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { EstadoAtencionComponent } from './pages/estadoAtencion/estadoAtencion.component';
import { EstadoAtencionEdicionComponent } from './pages/estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';

const routes: Routes = [
  { path: 'pages/paciente', component: PacienteComponent },
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
