import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { PacienteDialogUserviewComponent } from '../paciente-dialog-userview/paciente-dialog-userview.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = [
    'index',
    'nombreCompletoPaciente',
    'dniPaciente',
    'estadoAtencion',
    'Acceder'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private pacienteService: PacienteService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
  }

  openDialog(paciente: Paciente) {
    this.dialog.open(PacienteDialogUserviewComponent, {
      width: '100%',
      height: '90%',
      data: paciente
    });
  }
}
