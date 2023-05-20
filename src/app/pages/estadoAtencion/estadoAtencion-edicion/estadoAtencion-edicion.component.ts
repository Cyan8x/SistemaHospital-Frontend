import { Component, OnInit, Inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-estadoAtencion-edicion',
  templateUrl: './estadoAtencion-edicion.component.html',
  styleUrls: ['./estadoAtencion-edicion.component.css'],
})
export class EstadoAtencionEdicionComponent implements OnInit {

  estadoAtencion: EstadoAtencion;
  tipo: string = 'Registro';

  miInput: string = '';
  verificar: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<EstadoAtencionEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EstadoAtencion,
    private estadoAtencionService: EstadoAtencionService
  ) { }

  ngOnInit(): void {
    this.estadoAtencion = { ...this.data };
    if (this.data != null && this.data.estado_atencion_id > 0) {
      this.tipo = 'Edicion'
    }
  }

  operar() {
    if (this.estadoAtencion != null && this.estadoAtencion.estado_atencion_id > 0) {
      //MODIFICAR
      this.estadoAtencionService
        .modificar(this.estadoAtencion)
        .pipe(
          switchMap(() => {
            return this.estadoAtencionService.listar();
          })
        )
        .subscribe((data) => {
          this.estadoAtencionService.setEstadoAtencionCambio(data);
          this.estadoAtencionService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.estadoAtencionService
        .registrar(this.estadoAtencion)
        .pipe(
          switchMap(() => {
            return this.estadoAtencionService.listar();
          })
        )
        .subscribe((data) => {
          this.estadoAtencionService.setEstadoAtencionCambio(data);
          this.estadoAtencionService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  validarInput() {
    this.verificar = this.estadoAtencion.nombreEstadoAtencion.trim() === '';
  }

  cerrar() {
    this.dialogRef.close();
  }
}
