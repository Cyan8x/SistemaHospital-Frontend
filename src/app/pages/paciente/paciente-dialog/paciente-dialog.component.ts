import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { Paciente } from 'src/app/_model/paciente';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  paciente: Paciente;
  estadoAtencion: EstadoAtencion[];
  selectedEstado: EstadoAtencion;
  opcionSeleccionado: number;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private estadoAtencionService: EstadoAtencionService) {

  }

  ngOnInit(): void {
    this.paciente = { ...this.data };

    this.estadoAtencionService.listar().subscribe(
      (res: any) => this.estadoAtencion = res,
      (err: any) => console.error('Ha ocurrido un error al tratar de obtener los proyectos.')
    );

    this.selectedEstado = {...this.data.estadoAtencion};
    this.opcionSeleccionado = this.selectedEstado.estado_atencion_id;

    // this.paciente = new Paciente();
    // this.paciente.nombresPaciente = this.data.nombresPaciente;
  }

  selectEstado() {
    this.estadoAtencionService.listarPorId(this.opcionSeleccionado).subscribe(
      (res: any) => this.selectedEstado = res,
      (err: any) => console.error('Ha ocurrido un error al tratar de obtener los proyectos.')
    );
  }

  operar() {
    this.paciente.estadoAtencion = this.selectedEstado;
    if (this.paciente != null && this.paciente.paciente_id > 0) {
      //MODIFICAR
      this.pacienteService
        .modificar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listar();
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.pacienteService
        .registrar(this.paciente)
        .pipe(
          switchMap(() => {
            return this.pacienteService.listar();
          })
        )
        .subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
