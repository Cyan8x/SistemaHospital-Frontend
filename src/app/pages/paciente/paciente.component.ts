import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { PacienteDialogComponent } from './paciente-dialog/paciente-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
})
export class PacienteComponent implements OnInit {
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = [
    'paciente_id',
    'nombresPaciente',
    'apellidosPaciente',
    'dniPaciente',
    'direccionPaciente',
    'emailPaciente',
    'telefonoPaciente',
    'esActivo',
    'esFavorito',
    'estadoAtencion',
    'usuarioCreador',
    'acciones'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pacienteService: PacienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.pacienteService.getPacienteCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.pacienteService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.pacienteService.listar().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(paciente?: Paciente) {
    this.dialog.open(PacienteDialogComponent, {
      width: '50%',
      height: '95%',
      data: paciente
    });
  }

  eliminar(paciente: Paciente) {
    this.pacienteService
      .delete(paciente.paciente_id)
      .pipe(
        switchMap(() => {
          return this.pacienteService.listar();
        })
      )
      .subscribe((data) => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('Se eliminó.');
      });
  }
}
