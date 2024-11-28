import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-source-dialog',
  standalone: true,
  templateUrl: './edit-source-dialog.component.html',
  styleUrls: ['./edit-source-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class EditSourceDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [data.source.name, [Validators.required]],
      type: [data.source.type, [Validators.required]],
      file_path: [data.source.file_path || ''],
      url: [data.source.url || ''],
      connection: [data.source.connection || {}],
      tables: [data.source.tables || []]
    });
  }

  save(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value); // Pass the updated source data
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
