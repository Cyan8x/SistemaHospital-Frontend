import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Notificacion } from 'src/app/_model/notificacion';
import * as moment from 'moment';
import { NotificacionService } from 'src/app/_service/notificacion.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/_model/usuario';
import { VerReporteProcedimientosComponent } from './ver-reporte-procedimientos/ver-reporte-procedimientos.component';
import { ConfirmarEliminacionDialogComponent } from '../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { FormatDateService } from 'src/app/_service/format-date.service';

@Component({
  selector: 'app-paciente-dialog-userview',
  templateUrl: './paciente-dialog-userview.component.html',
  styleUrls: ['./paciente-dialog-userview.component.css']
})
export class PacienteDialogUserviewComponent implements OnInit, AfterViewChecked{
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

  notificacion: Notificacion;

  acccionFavorite: string = "favorite";
  colorFavorite: string = "accent";

  usuarioLogueado: string;
  usuario: Usuario;

  mostrarBotonReporte: boolean;

  @ViewChild('commentContainer') commentContainer: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogUserviewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private procedimientoService: ProcedimientoService,
    private comentarioService: ComentarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionService,
    private pacienteService: PacienteService,
    public formatDate: FormatDateService
  ) {
  }

  ngOnInit(): void {
    this.paciente = { ...this.data };
    if (this.data != null && this.data.paciente_id > 0) {
      this.pacienteId = this.data.paciente_id;
    }

    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;

    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(data => {
      this.usuario = data;
      this.pacienteService.selectFavoritosPorUsuario(this.usuario.usuario_id).subscribe(data => {
        data.forEach((paciente) => {
          if (paciente.paciente_id == this.data.paciente_id) {
            this.acccionFavorite = "heart_broken";
            this.colorFavorite = "primary";
          }
        });
      });
    });

    this.datosProcedimientosDePaciente();
    this.datosComentariosDePaciente();
    this.cantidadProcedimientosTerminados();
    this.habilitarBotonReporte();
  }

  ngAfterViewChecked(): void {
    this.irALaUltimaDiv();
  }

  irALaUltimaDiv(): void {
    const containerElement = this.commentContainer.nativeElement;
    const lastChild = containerElement.lastChild.previousElementSibling;

    if (lastChild && lastChild.previousElementSibling) {
      lastChild.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  habilitarBotonReporte(){
    this.procedimientoService.listarProcedimientosPorPaciente(this.paciente.paciente_id).subscribe(data =>{
      if(data.length > 0){
        this.mostrarBotonReporte = true;
      }else{
        this.mostrarBotonReporte = false;
      }
    })
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
      this.habilitarBotonReporte();
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
    let dialoRef = this.dialog.open(ProcedimientoDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        procedimiento: procedimiento,
        paciente: this.paciente
      }
    });

    dialoRef.afterClosed().subscribe(()=>{
      this.cantidadProcedimientosTerminados();
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
    let causa = "";
    if (procedimiento.es_terminado) {
      procedimiento.es_terminado = false;
      causa = "Se marcó como pendiente un procedimiento";
    } else {
      procedimiento.es_terminado = true;
      causa = "Se ha completado un procedimiento";
    }
    this.procedimientoService
      .modificar(procedimiento)
      .pipe(
        switchMap((proced: Procedimiento) => {
          this.prepararNotificacion(causa, proced);
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
        this.habilitarBotonReporte();
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

  confirmacionEliminacionProcedimiento(procedimiento: Procedimiento): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el procedimiento?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
            this.habilitarBotonReporte();
          });
      }
    });
  }

  confirmacionEliminacionComentario(comentario: Comentario): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el comentario?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comentarioService.delete(comentario.comentario_id).pipe(switchMap(() => {
          return this.comentarioService.listarComentariosPorPaciente(this.paciente.paciente_id);
        }))
          .subscribe(data => {
            this.comentarioService.setComentarioCambio(data);
            this.comentarioService.setMensajeCambio('Se eliminó.');
          });
      }
    });
  }

  marcarFavoritoPorusuario(paciente_id: number) {
    if (this.acccionFavorite == "heart_broken") {
      this.pacienteService.deleteFavoritoPorUsuario(this.usuario.usuario_id, paciente_id).subscribe(data => {
        this.acccionFavorite = "favorite";
        this.colorFavorite = "accent";
      });
    } else {
      this.pacienteService.insertFavoritoPorUsuario(this.usuario.usuario_id, paciente_id).subscribe(data => {
        this.acccionFavorite = "heart_broken";
        this.colorFavorite = "primary";
      });
    }
  }

  verReporteEnDialog() {
    this.dialog.open(VerReporteProcedimientosComponent, {
      width: '800px',
      height: '800px',
      data: this.pacienteId
    });
  }

  prepararNotificacion(causa:string, procedimiento:Procedimiento){
    //CREANDO NOTIFICACION
    let notificacion = new Notificacion();
    notificacion.fechaHoraNotificacion = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    notificacion.procedimiento = procedimiento;
    notificacion.usuarioOrigen = this.usuarioService.getUsuarioLogueado();
    notificacion.usuarioDestino = this.paciente.usuario.usuario_id;
    notificacion.causa = causa;
    this.notificacionService.registrar(notificacion).subscribe(data => {
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
