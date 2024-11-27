import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-source-dialog',
  templateUrl: './edit-source-dialog.component.html',
  styleUrls: ['./edit-source-dialog.component.scss'],
})
export class EditSourceDialogComponent {
  editSourceForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EditSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editSourceForm = this.fb.group({
      name: [data.source.name, Validators.required],
      type: [data.source.type, Validators.required],
      file_path: [data.source.file_path],
    });
  }

  onSubmit(): void {
    if (this.editSourceForm.valid) {
      this.dialogRef.close(this.editSourceForm.value); // Pass the edited data back to the parent
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
