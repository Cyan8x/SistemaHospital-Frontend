import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-eliminacion-dialog',
  templateUrl: './confirmar-eliminacion-dialog.component.html',
  styleUrls: ['./confirmar-eliminacion-dialog.component.css']
})
export class ConfirmarEliminacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
