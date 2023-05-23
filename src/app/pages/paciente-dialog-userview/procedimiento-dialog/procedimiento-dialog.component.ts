import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import * as moment from 'moment';

@Component({
  selector: 'app-procedimiento-dialog',
  templateUrl: './procedimiento-dialog.component.html',
  styleUrls: ['./procedimiento-dialog.component.css']
})
export class ProcedimientoDialogComponent implements OnInit {
  procedimiento: Procedimiento;
  paciente: Paciente;

  tipo: string = 'Registro';

  miInput: string = '';
  verificar: boolean = true;

  myDatePicker?: moment.Moment = moment(new Date());
  
  myTimePicker?: moment.Moment = moment(new Date());

  selectedDate?: moment.Moment = moment(new Date());



  constructor(
    private dialogRef: MatDialogRef<ProcedimientoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private procedimientoService: ProcedimientoService) {

  }

  ngOnInit(): void {
    this.procedimiento = { ...this.data.procedimiento };
    this.paciente = { ...this.data.paciente };

    if (this.procedimiento != null && this.procedimiento.procedimiento_id > 0) {
      this.tipo = 'Edicion'
    }
  }

  operar() {
    this.procedimiento.paciente = this.paciente;
    if (this.procedimiento != null && this.procedimiento.procedimiento_id > 0) {
      //MODIFICAR
      this.procedimientoService
        .modificar(this.procedimiento)
        .pipe(
          switchMap(() => {
            return this.procedimientoService.listar();
          })
        )
        .subscribe((data) => {
          this.procedimientoService.setProcedimientoCambio(data);
          this.procedimientoService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.procedimientoService
        .registrar(this.procedimiento)
        .pipe(
          switchMap(() => {
            return this.procedimientoService.listar();
          })
        )
        .subscribe((data) => {
          this.procedimientoService.setProcedimientoCambio(data);
          this.procedimientoService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  validarInput() {
    if (this.procedimiento.procedimiento.trim() === '') {
      this.verificar = true;
    } else {
      this.verificar = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
