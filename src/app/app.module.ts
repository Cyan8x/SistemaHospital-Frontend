import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { EstadoAtencionComponent } from './pages/estadoAtencion/estadoAtencion.component';
import { HttpClientModule } from '@angular/common/http';
import { EstadoAtencionEdicionComponent } from './pages/estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteDialogComponent } from './pages/paciente/paciente-dialog/paciente-dialog.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RolComponent } from './pages/rol/rol.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RolDialogComponent } from './pages/rol/rol-dialog/rol-dialog.component';
import { UsuarioDialogComponent } from './pages/usuario/usuario-dialog/usuario-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    EstadoAtencionComponent,
    EstadoAtencionEdicionComponent,
    PacienteDialogComponent,
    InicioComponent,
    RolComponent,
    UsuarioComponent,
    RolDialogComponent,
    UsuarioDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule, //Formularios
    FormsModule //Two Way Biding
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
