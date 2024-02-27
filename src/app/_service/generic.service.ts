import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SuccessMessageDialogComponent } from '../pages/success-message-dialog/success-message-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) {}

  listarPagination(p:number, s:number) {
    return this.http.get<any>(`${this.url}/pagination/?page=${p}&size=${s}`);
  }

  listar() {
    return this.http.get<T[]>(`${this.url}`);
  }

  listarPorId(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  registrar(t: T) {
    return this.http.post(this.url, t);
  }

  modificar(t: T) {
    return this.http.put(this.url, t);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  successMessageDialog(message: string, dialog:MatDialog): void {
    let dialogReff = dialog.open(SuccessMessageDialogComponent, {
      disableClose: true,
      data: message
    });

    setTimeout(() => {
      dialogReff.close();
    }, 3000); // Duración de 3 segundos (ajusta el valor según tus necesidades)
  }
}
