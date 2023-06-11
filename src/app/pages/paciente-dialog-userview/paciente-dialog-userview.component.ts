import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import { ProcedimientoDialogComponent } from './procedimiento-dialog/procedimiento-dialog.component';
import { ComentarioService } from 'src/app/_service/comentario.service';
import { Comentario } from 'src/app/_model/comentario';
import { ComentarioDialogComponent } from './comentario-dialog/comentario-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-paciente-dialog-userview',
  templateUrl: './paciente-dialog-userview.component.html',
  styleUrls: ['./paciente-dialog-userview.component.css']
})
export class PacienteDialogUserviewComponent implements OnInit {
  paciente: Paciente;
  procedimientos: Procedimiento[];
  procedimientosPendientes: Procedimiento[];
  procedimientosTerminados: Procedimiento[];
  comentario: Comentario;
  comentarios: Comentario[];
  textoComentario: string;
  pacienteId: number;
  cantTerminados: number;

  mostrarContenido: string = 'Mostrar Completados';
  esClickeado: boolean = false;
  color: string = 'warn';

  marcado: boolean;


  mostrarBotonComentar: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private procedimientoService: ProcedimientoService,
    private comentarioService: ComentarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.paciente = { ...this.data };

    this.datosProcedimientosDePaciente();
    this.datosComentariosDePaciente();

    this.cantidadProcedimientosTerminados();


  }

  datosComentariosDePaciente() {
    this.comentarioService.listarComentariosPorPaciente(this.paciente.paciente_id).subscribe((data) => {
      this.comentarios = data;
    })

    this.comentarioService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.comentarioService.getComentarioCambio().subscribe((data) => {
      this.comentarios = data;
    });
  }

  datosProcedimientosDePaciente() {
    this.procedimientoService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.procedimientoService.getProcedimientoCambio().subscribe((data) => {
      this.procedimientos = data;
    });

    this.procedimientoService.listarProcedimientosPendientesPorPaciente(this.paciente.paciente_id).subscribe((data) => {
      this.procedimientos = data;
    })
  }

  cantidadProcedimientosTerminados() {
    this.procedimientoService.listarProcedimientosTerminadosPorPaciente(this.paciente.paciente_id).subscribe((data) => {
      this.procedimientosTerminados = data;
      this.cantTerminados = this.procedimientosTerminados.length;
      if (this.cantTerminados == 0) {
        this.mostrarContenido = 'Mostrar Completados';
        this.color = 'warn';
        this.datosProcedimientosDePaciente();
        this.esClickeado = false;
      }
    })
  }

  openDialogProcedimiento(procedimiento?: Procedimiento) {
    this.dialog.open(ProcedimientoDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        procedimiento: procedimiento,
        paciente: this.paciente
      }
    });
  }

  openDialogComentario(comentario?: Comentario) {
    this.dialog.open(ComentarioDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        comentario: comentario,
        paciente: this.paciente
      }
    });
  }

  procedimientoTerminado(procedimiento: Procedimiento) {
    if (procedimiento.es_terminado) {
      procedimiento.es_terminado = false;
    } else {
      procedimiento.es_terminado = true;
    }
    this.procedimientoService
      .modificar(procedimiento)
      .pipe(
        switchMap(() => {
          if (this.mostrarContenido == 'Mostrar Completados') {
            return this.procedimientoService.listarProcedimientosPendientesPorPaciente(this.paciente.paciente_id);
          }
          return this.procedimientoService.listarProcedimientosPorPaciente(this.paciente.paciente_id);
        })
      )
      .subscribe((data) => {
        this.procedimientoService.setProcedimientoCambio(data);
        this.procedimientoService.setMensajeCambio('Se modificó.');
        this.cantidadProcedimientosTerminados();
      });
  }

  cambiarContenidoBoton() {
    if (this.esClickeado) {
      this.mostrarContenido = 'Mostrar Completados';
      this.color = 'warn';
      this.datosProcedimientosDePaciente();
    } else {
      this.mostrarContenido = 'Ocultar Completados';
      this.color = 'primary';
      this.procedimientoService.listarProcedimientosPorPaciente(this.paciente.paciente_id).subscribe((data) => {
        this.procedimientos = data;
      })
    }
    this.esClickeado = !this.esClickeado;
  }

  eliminar(procedimiento: Procedimiento) {
    this.procedimientoService.delete(procedimiento.procedimiento_id).pipe(switchMap(() => {
      if (this.mostrarContenido == 'Mostrar Completados') {
        return this.procedimientoService.listarProcedimientosPendientesPorPaciente(this.paciente.paciente_id);
      }
      return this.procedimientoService.listarProcedimientosPorPaciente(this.paciente.paciente_id);
    }))
      .subscribe(data => {
        this.procedimientoService.setProcedimientoCambio(data);
        this.procedimientoService.setMensajeCambio('Se eliminó.');
        this.cantidadProcedimientosTerminados();
      });
  }

}
