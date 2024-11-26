import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-source-dialog',
  templateUrl: './edit-source-dialog.component.html',
  styleUrls: ['./edit-source-dialog.component.scss'],
})
export class EditSourceDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [data.source.name, Validators.required],
      type: [data.source.type, Validators.required],
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
