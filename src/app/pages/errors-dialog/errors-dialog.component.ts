import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-errors-dialog',
  templateUrl: './errors-dialog.component.html',
  styleUrls: ['./errors-dialog.component.css']
})
export class ErrorsDialogComponent implements OnInit{

  errorMessages: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    private dialogRef: MatDialogRef<ErrorsDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.errorMessages = this.data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
