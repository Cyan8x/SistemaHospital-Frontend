import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PacienteDialogUserviewComponent } from '../paciente-dialog-userview/paciente-dialog-userview.component';
import { Paciente } from 'src/app/_model/paciente';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-auxurldialog',
  templateUrl: './auxurldialog.component.html',
  styleUrls: ['./auxurldialog.component.css']
})
export class AuxurldialogComponent implements OnInit {

  rutaAnterior: string;
  paciente: Paciente;
  paciente_id: number;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paciente_id = params['id'];
    });

    this.rutaAnterior = history.state.urlAnterior;
  }

  ngAfterViewInit() {
    this.pacienteService.listarPorId(this.paciente_id).subscribe((data) => {
      this.paciente = data;
      this.openDialog(this.paciente);
    });
  }

  openDialog(paciente: Paciente) {
    const dialogRef = this.dialog.open(PacienteDialogUserviewComponent, {
      width: '100%',
      height: '100%',
      data: paciente
    });

    if (this.rutaAnterior == null) {
      this.rutaAnterior = '/pages/inicio';
    }

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl(this.rutaAnterior);
    });
  }


}
