import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsistenciaService } from 'src/app/_service/asistencia.service';

@Component({
  selector: 'app-ver-reporte',
  templateUrl: './ver-reporte.component.html',
  styleUrls: ['./ver-reporte.component.css']
})
export class VerReporteComponent implements OnInit{

  pdfSrc: any;
  usuario_id: number;

  constructor(private asistenciaService: AsistenciaService,
    private dialogRef: MatDialogRef<number>,
    @Inject(MAT_DIALOG_DATA) private data: number){

  }

  ngOnInit(): void {
    this.usuario_id = this.data;
    if (this.data != null && this.data > 0) {
      this.verReporte(this.data);
    }
  }

  verReporte(usuario_id: number) {
    this.asistenciaService.generarReporteAsistenciaUsuario(usuario_id).subscribe(data => {
      this.pdfSrc = window.URL.createObjectURL(data);

      // let reader = new FileReader();
      // reader.onload = (e:any) => {
      //   this.pdfSrc = e.target.result;
      // };
      // reader.readAsArrayBuffer(data);
    });
  }

  descargarReporte(usuario_id: number) {
    this.asistenciaService.generarReporteAsistenciaUsuario(usuario_id).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'disply:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Reporte Asistencias.pdf';
      a.click();
    });
  }
}
