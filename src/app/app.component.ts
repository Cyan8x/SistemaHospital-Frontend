import { Component } from '@angular/core';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SistemaHospital-Frontend';

  constructor(
    private dialog: MatDialog
  ) { }


  openDialog() {
    this.dialog.open(BuscarComponent, {
      width: '100%',
      height: '95%'
    });
  }
}

