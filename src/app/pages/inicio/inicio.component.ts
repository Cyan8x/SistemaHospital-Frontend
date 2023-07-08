import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, first } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { PacienteDialogComponent } from '../paciente/paciente-dialog/paciente-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { ChartOptions } from './mitrabajo/mitrabajo.component';
import { ErrorsDialogComponent } from '../errors-dialog/errors-dialog.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  pacientesFavoritos: Observable<Paciente[]>;
  isVacioPacientesFavoritos: boolean;

  textoBoton: string = "Mi Trabajo";
  iconBoton: string = "work"
  mostrarCalendario: boolean = false;

  usuarioLogueado: string;
  usuario: Usuario;

  seriesPacienteCant: number[] = [];
  labelsPacienteName: string[] = [];

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
  ) {
    this.chartOptions = {
      series: this.seriesPacienteCant,
      chart: {
        width: 450,
        type: "pie"
      },
      labels: this.labelsPacienteName,
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


  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;

    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(
      data => {
        this.usuario = data;
        this.usuarioService.setUsuarioLogueado(this.usuario);
        this.listarFavoritos(this.usuario.usuario_id);
        this.definirGrafico();
        this.pacientesFavoritos.pipe(
          first()
        ).subscribe(
          pacientes => {
            if (pacientes.length === 0) {
              // El Observable está vacío
              this.isVacioPacientesFavoritos = false;
            } else {
              // El Observable tiene al menos un valor
              this.isVacioPacientesFavoritos = true
            }
          },
          error => {
            // Manejar el error si ocurre
            let message = `Error al obtener los pacientes favoritos: ${error}`
            this.dialog.open(ErrorsDialogComponent, {
              data: message
            });
          }
        );
      }
    );
  }

  definirGrafico() {
    this.pacienteService.cantidadPacientesPorEstado().subscribe(data => {
      if (data != null) {
        for (const clave in data) {
          if (data.hasOwnProperty(clave)) {
            const valor = data[clave];
            this.seriesPacienteCant.push(valor);
            this.labelsPacienteName.push(clave);
          }
        }
        this.chartOptions = {
          series: this.seriesPacienteCant,
          chart: {
            width: 450,
            type: "pie"
          },
          labels: this.labelsPacienteName,
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
        this.seriesPacienteCant = [];
        this.labelsPacienteName = [];
      }
    });
  }

  mostrarTrabajo() {
    this.mostrarCalendario = !this.mostrarCalendario;

    if (this.mostrarCalendario) {
      this.textoBoton = "Calendario";
      this.iconBoton = "calendar_month"
      this.router.navigate(['/pages/inicio/mitrabajo', this.usuario.usuario_id])
    } else {
      this.textoBoton = "Mi Trabajo";
      this.iconBoton = "work"
      this.router.navigate(['/pages/inicio/calendario', this.usuario.usuario_id])
    }
  }

  listarFavoritos(usuario_id: number) {
    this.pacientesFavoritos = this.pacienteService.selectFavoritosPorUsuario(usuario_id);
  }

  redireccionarConParametros(paciente_id: number) {
    const currentRoute: NavigationExtras = {
      state: {
        urlAnterior: this.router.url
      }
    };
    this.router.navigate(['/pages/paciente-userview', paciente_id], currentRoute);
  }

  registrarPacienteDialog() {
    this.dialog.open(PacienteDialogComponent, {
      width: '50%',
      height: '95%'
    });
  }
}

