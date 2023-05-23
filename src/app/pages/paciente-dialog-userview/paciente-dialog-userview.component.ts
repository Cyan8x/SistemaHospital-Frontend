import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import { ProcedimientoDialogComponent } from './procedimiento-dialog/procedimiento-dialog.component';

@Component({
  selector: 'app-paciente-dialog-userview',
  templateUrl: './paciente-dialog-userview.component.html',
  styleUrls: ['./paciente-dialog-userview.component.css']
})
export class PacienteDialogUserviewComponent implements OnInit {
  paciente: Paciente;
  procedimientos: Procedimiento[];

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogUserviewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private procedimientoService: ProcedimientoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.paciente = { ...this.data };

    this.procedimientoService.listar().subscribe((data) => {
      this.procedimientos = data;
    })
  }

  openDialog(procedimiento?: Procedimiento) {
    this.dialog.open(ProcedimientoDialogComponent, {
      width: '50%',
      height: '90%',
      data: {
        procedimiento: procedimiento,
        paciente: this.paciente
      }
    });
  }

}
