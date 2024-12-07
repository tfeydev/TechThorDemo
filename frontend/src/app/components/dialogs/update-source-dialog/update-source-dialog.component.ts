import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-source-dialog',
  templateUrl: './update-source-dialog.component.html',
  styleUrls: ['./update-source-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatIconModule
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

    const tables = Array.isArray(source.tables) ? source.tables : (source.tables ? [source.tables] : []);

    this.updateForm = this.fb.group({
      name: [source.name || '', [Validators.required]],
      type: [source.type || '', [Validators.required]],
      url: [source.url || ''],
      headers: [JSON.stringify(source.headers || {}, null, 2)],
      params: [JSON.stringify(source.params || {}, null, 2)],
      file_path: [source.file_path || ''],
      delimiter: [source.delimiter || ','],
      encoding: [source.encoding || 'utf-8'],
      db_type: [source.db_type || ''],
      host: [source.host || ''],
      port: [source.port || null],
      user: [source.user || ''],
      password: [source.password || ''],
      db_name: [source.db_name || ''],
      tables: [tables.join(', ')],
      queries: this.fb.array(
        (source.queries || []).map((query: { name: string; query: string }) =>
          this.fb.group({
            name: [query.name || '', [Validators.required]],
            query: [query.query || '', [Validators.required]],
          })
        )
      ),
    });
  }

  get queries(): FormArray {
    return this.updateForm.get('queries') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  addQuery(): void {
    this.queries.push(
      this.fb.group({
        name: ['', [Validators.required]],
        query: ['', [Validators.required]],
      })
    );
  }

  removeQuery(index: number): void {
    this.queries.removeAt(index);
  }

  save(): void {
    if (this.updateForm.valid) {
      const formValue = { ...this.updateForm.value };

      formValue.tables = formValue.tables
        ? formValue.tables.split(',').map((t: string) => t.trim())
        : [];

      formValue.queries = this.queries.value || [];

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
      this.dialogRef.close(formValue);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
