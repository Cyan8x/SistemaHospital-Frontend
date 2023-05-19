import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  pacientes: Observable<Paciente[]>;

  constructor(
    private pacienteService: PacienteService,
  ) { }

  ngOnInit(): void {
    this.listarFavoritos();
  }

  listarFavoritos() {
    this.pacientes = this.pacienteService.listarFavoritos();
  }

}

