import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { Usuario } from 'src/app/_model/usuario';
import { PacienteService } from 'src/app/_service/paciente.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  usuario_id: number;
  usuarios:Usuario[];
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = [
    'index',
    'nombreCompletoPaciente',
    'Documento',
    'estadoAtencion',
    'Acceder'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((data) => {
      this.crearTabla(data);
    });

    this.usuarioService.listar().subscribe(data =>{
      this.usuarios = data;
    });
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  redireccionarConParametros(paciente_id: number) {
    const currentRoute: NavigationExtras = {
      state: {
        urlAnterior: this.router.url
      }
    };
    this.router.navigate(['/pages/paciente-userview', paciente_id],currentRoute);
  }
}
