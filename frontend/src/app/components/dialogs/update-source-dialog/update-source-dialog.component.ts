import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-source-dialog',
  templateUrl: './update-source-dialog.component.html',
  styleUrls: ['./update-source-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class UpdateSourceDialogComponent {
  updateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      name: [data.source.name, [Validators.required]],
      type: [data.source.type, [Validators.required]],
      file_path: [data.source.file_path || ''],
      url: [data.source.url || ''],
      headers: [data.source.headers || {}],
      params: [data.source.params || {}],
      connection: [data.source.connection || {}],
      tables: [data.source.tables || []],
    });
  }

  save(): void {
    if (this.updateForm.valid) {
      console.log('Form submitted:', this.updateForm.value); // Debug
      this.dialogRef.close(this.updateForm.value); // Daten an Dashboard zurückgeben
    } else {
      console.error('Form is invalid:', this.updateForm.errors); // Debugging
    }
  }
  
  

  cancel(): void {
    this.dialogRef.close();
  }
}
