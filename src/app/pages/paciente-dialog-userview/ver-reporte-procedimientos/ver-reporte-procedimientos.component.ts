import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcedimientoService } from 'src/app/_service/procedimiento.service';

@Component({
  selector: 'app-ver-reporte-procedimientos',
  templateUrl: './ver-reporte-procedimientos.component.html',
  styleUrls: ['./ver-reporte-procedimientos.component.css']
})
export class VerReporteProcedimientosComponent implements OnInit {
  pdfSrc: any;
  paciente_id: number;

  constructor(private procedimientoService: ProcedimientoService,
    private dialogRef: MatDialogRef<number>,
    @Inject(MAT_DIALOG_DATA) private data: number) {

  }

  ngOnInit(): void {
    this.paciente_id = this.data;
    if (this.data != null && this.data > 0) {
      this.verReporte(this.data);
    }
  }

  verReporte(paciente_id: number) {
    this.procedimientoService.generarReporteProcedimientosPaciente(paciente_id).subscribe(data => {
      this.pdfSrc = window.URL.createObjectURL(data);

      // let reader = new FileReader();
      // reader.onload = (e:any) => {
      //   this.pdfSrc = e.target.result;
      // };
      // reader.readAsArrayBuffer(data);
    });
  }

  descargarReporte(paciente_id: number) {
    this.procedimientoService.generarReporteProcedimientosPaciente(paciente_id).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'disply:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Reporte Procedimientos.pdf';
      a.click();
    });
  }
}
