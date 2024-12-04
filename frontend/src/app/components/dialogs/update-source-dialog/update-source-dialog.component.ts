import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-source-dialog',
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

    // Ensure `tables` is always an array
    const tables = Array.isArray(source.tables) ? source.tables : (source.tables ? [source.tables] : []);

    this.updateForm = this.fb.group({
      // General Fields
      name: [source.name || '', [Validators.required]],
      type: [source.type || '', [Validators.required]],
  
      // API Fields
      url: [source.url || ''],
      headers: [JSON.stringify(source.headers || {}, null, 2)],
      params: [JSON.stringify(source.params || {}, null, 2)],
  
      // CSV Fields
      file_path: [source.file_path || ''],
      delimiter: [source.delimiter || ','],
      encoding: [source.encoding || 'utf-8'],
  
      // Database Fields
      db_type: [source.db_type || ''],
      host: [source.host || ''],
      port: [source.port || null],
      user: [source.user || ''],
      password: [source.password || ''],
      db_name: [source.db_name || ''],
      query: [source.queries?.[0]?.query || ''], // Extract first query for display
      tables: [tables.join(', ')], // Join tables array into comma-separated string
    });
  }
  
  save(): void {
    if (this.updateForm.valid) {
      const formValue = { ...this.updateForm.value };
  
      // Convert tables back to an array
      formValue.tables = formValue.tables ? formValue.tables.split(',').map((t: string) => t.trim()) : [];
  
      // Handle queries (wrap in an array if present)
      if (formValue.query) {
        formValue.queries = [{ name: 'default-query', query: formValue.query }];
        delete formValue.query;
      }
  
      // Parse JSON fields (headers and params)
      try {
        formValue.headers = formValue.headers ? JSON.parse(formValue.headers) : {};
      } catch (e) {
        console.error('Invalid headers JSON:', e);
        formValue.headers = {};
      }
  
      try {
        formValue.params = formValue.params ? JSON.parse(formValue.params) : {};
      } catch (e) {
        console.error('Invalid params JSON:', e);
        formValue.params = {};
      }
  
      console.log('Payload sent to backend:', formValue);
      this.dialogRef.close(formValue); // Send the payload to the backend
    }
  }  
  
  cancel(): void {
    this.dialogRef.close();
  }
}
