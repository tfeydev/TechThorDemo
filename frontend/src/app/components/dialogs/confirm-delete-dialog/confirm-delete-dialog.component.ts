import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-confirm-delete-dialog',
    templateUrl: './confirm-delete-dialog.component.html',
    styleUrls: ['./confirm-delete-dialog.component.scss'],
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
