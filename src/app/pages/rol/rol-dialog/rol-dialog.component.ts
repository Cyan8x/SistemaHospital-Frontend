import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.css']
})
export class RolDialogComponent {
  rol: Rol;

  constructor(
    private dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private rolService: RolService) {

  }

  ngOnInit(): void {
    this.rol = { ...this.data };
  }

  operar() {
    if (this.rol != null && this.rol.rol_id > 0) {
      //MODIFICAR
      this.rolService
        .modificar(this.rol)
        .pipe(
          switchMap(() => {
            return this.rolService.listar();
          })
        )
        .subscribe((data) => {
          this.rolService.setRolCambio(data);
          this.rolService.setMensajeCambio('Se modificó.');
        });
    } else {
      //REGISTRAR
      this.rolService
        .registrar(this.rol)
        .pipe(
          switchMap(() => {
            return this.rolService.listar();
          })
        )
        .subscribe((data) => {
          this.rolService.setRolCambio(data);
          this.rolService.setMensajeCambio('Se registró.');
        });
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
