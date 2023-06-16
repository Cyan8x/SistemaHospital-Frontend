import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class PacienteDialogUserviewComponent implements OnInit, AfterViewInit {
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

  disableScrollToBottom = false;

  mostrarBotonComentar: boolean = false;


  @ViewChild('commentContainer') commentContainer: ElementRef;

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

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.commentContainer.nativeElement;
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }, 0);
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (!atBottom) {
      // El scroll no está en la parte inferior, deshabilita el desplazamiento automático
      this.disableScrollToBottom = true;
    } else {
      // El scroll está en la parte inferior
      this.disableScrollToBottom = false;
    }
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

  eliminarProcedimiento(procedimiento: Procedimiento) {
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

  eliminarComentario(comentario: Comentario) {
    this.comentarioService.delete(comentario.comentario_id).pipe(switchMap(() => {
      return this.comentarioService.listarComentariosPorPaciente(this.paciente.paciente_id);
    }))
      .subscribe(data => {
        this.comentarioService.setComentarioCambio(data);
        this.comentarioService.setMensajeCambio('Se eliminó.');
      });
  }

}
