import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoAtencion } from 'src/app/_model/estadoAtencion';
import { EstadoAtencionService } from 'src/app/_service/estadoAtencion.service';

@Component({
  selector: 'app-estadoAtencion-edicion',
  templateUrl: './estadoAtencion-edicion.component.html',
  styleUrls: ['./estadoAtencion-edicion.component.css'],
})
export class EstadoAtencionEdicionComponent implements OnInit {
  id: number = 0;
  edicion: boolean = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private estadoAtencionService: EstadoAtencionService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      nombres: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.estadoAtencionService.listarPorId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.estado_atencion_id),
          nombres: new FormControl(data.nombreEstadoAtencion),
        });
      });
    }
  }

  operar() {
    let estadoAtencion = new EstadoAtencion;
    estadoAtencion.estado_atencion_id = this.form.value['id'];
    estadoAtencion.nombreEstadoAtencion = this.form.value['nombres'];

    if (this.edicion) {
      //MODIFICAR
      this.estadoAtencionService.modificar(estadoAtencion).subscribe(() =>{
        this.estadoAtencionService.listar().subscribe(data=>{
          this.estadoAtencionService.estadoAtencionCambio.next(data);
          this.estadoAtencionService.mensajeCambio.next('Se modificó.');
        });
      });
    } else {
      //REGISTRAR
      this.estadoAtencionService.registrar(estadoAtencion).subscribe(() =>{
        this.estadoAtencionService.listar().subscribe(data=>{
          this.estadoAtencionService.estadoAtencionCambio.next(data);
          this.estadoAtencionService.mensajeCambio.next('Se registró.');
        });
      });
    }

    this.router.navigate(['/pages/estadoAtencion']);
  }
}
