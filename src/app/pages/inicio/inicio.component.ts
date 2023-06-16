import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';
import { PacienteDialogComponent } from '../paciente/paciente-dialog/paciente-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

interface ProcedimientoNode {
  procedimiento: string;
  children?: ProcedimientoNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  procedimiento: string;
  level: number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  pacientesFavoritos: Observable<Paciente[]>;

  procedimientos: Procedimiento[];
  textoProcedimientos: ProcedimientoNode[] = [];

  usuarioLogueado:string;
  usuario: Usuario;

  procedimientosHoy: ProcedimientoNode[];

  private _transformer = (node: ProcedimientoNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      procedimiento: node.procedimiento,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private procedimientoService: ProcedimientoService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService
  ) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuarioLogueado = decodedToken.user_name;

    this.usuarioService.listarPorUsername(this.usuarioLogueado).subscribe(
      data => {
        this.usuario = data;
        this.usuarioService.setUsuarioLogueado(this.usuario);

        this.listarFavoritos(this.usuario.usuario_id);

        this.procedimientoService.selectProcedimientosPendientesPorUsuarioHoy(this.usuarioService.getUsuarioLogueado().usuario_id).subscribe((data) => {
          this.procedimientos = data;
          this.agregarElementosAlTree();
        })
      }
    );
  }

  agregarElementosAlTree() {

    this.procedimientos.forEach((proced) => {
      const procedimientoNode: ProcedimientoNode = {
        procedimiento: proced.procedimiento
      };
      this.textoProcedimientos.push(procedimientoNode);
    });

    this.procedimientosHoy = [
      {
        procedimiento: 'Hoy',
        children: this.textoProcedimientos
      }
    ]
    this.dataSource.data = this.procedimientosHoy;
    this.treeControl.expandAll();
  }

  listarFavoritos(usuario_id: number) {
    this.pacientesFavoritos = this.pacienteService.selectFavoritosPorUsuario(usuario_id);
  }

  redireccionarConParametros(paciente_id: number) {
    const currentRoute: NavigationExtras = {
      state: {
        urlAnterior: this.router.url
      }
    };
    this.router.navigate(['/pages/paciente-userview', paciente_id], currentRoute);
  }

  registrarPacienteDialog() {
    this.dialog.open(PacienteDialogComponent, {
      width: '50%',
      height: '95%'
    });
  }
}

