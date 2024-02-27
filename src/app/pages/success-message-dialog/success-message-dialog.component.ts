import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-message-dialog',
  templateUrl: './success-message-dialog.component.html',
  styleUrls: ['./success-message-dialog.component.css']
})
export class SuccessMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  cerrar() {
    this.dialogRef.close();
  }
}
