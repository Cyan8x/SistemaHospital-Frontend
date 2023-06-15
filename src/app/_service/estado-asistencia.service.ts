import { Injectable } from '@angular/core';
import { EstadoAsistencia } from '../_model/estadoAsistencia';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoAsistenciaService extends GenericService<EstadoAsistencia>{

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/estadoasistencia`);
  }
}
