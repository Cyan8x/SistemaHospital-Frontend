import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { PacienteDialogComponent } from './paciente-dialog/paciente-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { ConfirmarEliminacionDialogComponent } from '../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
})
export class PacienteComponent implements OnInit {
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = [
    'paciente_id',
    'nombrePaciente',
    'apellidosPaciente',
    'dniPaciente',
    'carneExtranjeria',
    // 'direccionPaciente',
    // 'emailPaciente',
    // 'telefonoPaciente',
    'esActivo',
    // 'esFavorito',
    'estadoAtencion',
    'usuarioCreador',
    'editar'
  ];

  usuarioLogueado: string;
  mostrarEdicion:boolean;

  cantidadDatos: number = 0;
  numPagina: any;
  sizePagina: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pacienteService: PacienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.pacienteService.getPacienteCambio().subscribe((data) => {
      this.pacienteService.listarPagination(this.numPagina,this.sizePagina).subscribe((data) => {
        this.cantidadDatos = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
      });
    });

    this.pacienteService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    // this.pacienteService.listar().subscribe((data) => {
    //   this.crearTabla(data);
    // });

    this.pacienteService.listarPagination(this.numPagina,this.sizePagina).subscribe((data) => {
      this.cantidadDatos = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;

    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(data => {
      if (data.rol.rol_id != 1) {
        this.mostrarEdicion = true;
      }

    });
  }

  filtrar(e: any) {
    if(e.target.value == ''){
      this.pacienteService.listarPagination(this.numPagina,this.sizePagina).subscribe((data) => {
        this.cantidadDatos = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
      });
    }
    this.dataSource.filter = e.target.value.trim().toLowerCase();
    this.cantidadDatos = this.dataSource.filteredData.length;
  }

  // crearTabla(data: Paciente[]) {
  //   this.dataSource = new MatTableDataSource(data);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

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

  openConfirmacionEliminacionDialog(paciente: Paciente): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro de eliminar el paciente: '${paciente.nombresPaciente}  ${paciente.apellidosPaciente}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pacienteService
          .delete(paciente.paciente_id)
          .pipe(
            switchMap(() => {
              return this.pacienteService.listar();
            })
          )
          .subscribe((data) => {
            this.pacienteService.setPacienteCambio(data);
            this.pacienteService.setMensajeCambio('Se eliminó el paciente seleccionado.');
          });
      }
    });
  }

  mostrarMas(e: PageEvent){
    this.pacienteService.listarPagination(e.pageIndex, e.pageSize).subscribe(data =>{
      this.cantidadDatos = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);

      this.numPagina = e.pageIndex;
      this.sizePagina = e.pageSize;
    });
  }
}
