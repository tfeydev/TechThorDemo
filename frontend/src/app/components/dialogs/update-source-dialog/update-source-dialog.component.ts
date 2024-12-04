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
    const source = data?.source || {};
    this.updateForm = this.fb.group({
      name: [source.name || '', [Validators.required]],
      type: [source.type || '', [Validators.required]],
      file_path: [source.file_path || ''],
      url: [source.url || ''],
      headers: [source.headers || {}],
      params: [source.params || {}],
      connection: [source.connection || {}],
      tables: [source.tables || []],
    });
  }

  save(): void {
    if (this.updateForm.valid) {
      const payload = { ...this.updateForm.value };
  
      // Remove empty fields
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== null && value !== '')
      );
  
      console.log('Updated Payload sent to backend:', cleanedPayload); // Debugging
      this.dialogRef.close(cleanedPayload);
    }
  }  
  
  cancel(): void {
    this.dialogRef.close();
  }
}
