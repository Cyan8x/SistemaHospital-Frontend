import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorsDialogComponent } from '../pages/errors-dialog/errors-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

  private dialogRef: MatDialogRef<any>;

  constructor(private router: Router, private dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(retry(environment.REINTENTOS))
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.error === true && event.body.errorMessage) {
            this.showErrorDialog(event.body.errorMessage);
            throw new Error(event.body.errorMessage);
          }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });
                    }*/
        }
        //variable err tiene el response json del backend
      })).pipe(catchError((err) => {
        //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        if (err.status === 400) {
          this.showErrorDialog(`${err.error.error_description}`); //ERROR 400:
        }
        else if (err.status === 404) {
          this.showErrorDialog(`${err.error.error_description}`); //ERROR 404:
        }
        else if (err.status === 403 || err.status === 401) {
          this.showErrorDialog(`${err.error.error_description}`); //ERROR 403:
        }
        else if (err.status === 500) {
          this.showErrorDialog(`${err.error.error_description}`); //ERROR 500:
        } else {
          this.showErrorDialog(`${err.error.error_description}`); //ERROR:
        }
        return EMPTY;
      }));
  }

  private verificarTraducirMessage(messageError: string){
    if(messageError == 'Bad credentials'){
      return "Usuario o Contraseña Invalidas";
    }else{
      return messageError;
    }
  }

  private showErrorDialog(messageError: string): void {
    let message = this.verificarTraducirMessage(messageError);
    this.dialogRef = this.dialog.open(ErrorsDialogComponent, {
      data: { message },
      disableClose: true
    });
  }
}
