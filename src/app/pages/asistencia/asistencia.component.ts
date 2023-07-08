import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asistencia } from 'src/app/_model/asistencia';
import { AsistenciaService } from 'src/app/_service/asistencia.service';
import { AsistenciaDialogComponent } from './asistencia-dialog/asistencia-dialog.component';
import { ConfirmarEliminacionDialogComponent } from '../confirmar-eliminacion-dialog/confirmar-eliminacion-dialog.component';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

  usuario_id: number;

  usuarios: Usuario[];


  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
    });
  }
}
