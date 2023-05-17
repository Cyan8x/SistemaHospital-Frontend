import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { EstadoAtencionComponent } from './pages/estadoAtencion/estadoAtencion.component';
import { HttpClientModule } from '@angular/common/http';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { EstadoAtencionEdicionComponent } from './pages/estadoAtencion/estadoAtencion-edicion/estadoAtencion-edicion.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    EstadoAtencionComponent,
    PacienteEdicionComponent,
    EstadoAtencionEdicionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
