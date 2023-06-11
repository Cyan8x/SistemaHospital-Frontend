import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Procedimiento } from 'src/app/_model/procedimiento';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';

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
  pacientes: Observable<Paciente[]>;

  procedimientos: Procedimiento[];
  textoProcedimientos: ProcedimientoNode[] = [];

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
  ) {
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.listarFavoritos();

    this.procedimientoService.getProcedimientoCambio().subscribe((data) => {
      this.procedimientos = data;
      this.agregarElementosAlTree();
    });

    this.procedimientoService.listar().subscribe((data) => {
      this.procedimientos = data;
      this.agregarElementosAlTree();
    })

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

  listarFavoritos() {
    this.pacientes = this.pacienteService.listarFavoritos();
  }

  redireccionarConParametros(paciente_id: number) {
    const currentRoute: NavigationExtras = {
      state: {
        urlAnterior: this.router.url
      }
    };
    this.router.navigate(['/pages/paciente-userview', paciente_id], currentRoute);
  }

}

