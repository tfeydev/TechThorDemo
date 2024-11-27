import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SourceService } from '../../../services/source.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-csv-source',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule 
  ],
  template: `
    <h3>CSV Source Configuration</h3>

    <form [formGroup]="csvForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>File Path</mat-label>
        <input matInput formControlName="file_path" />
        <mat-error *ngIf="csvForm.get('file_path')?.invalid && csvForm.get('file_path')?.touched">
          File path is required
        </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="csvForm.invalid">Add CSV Source</button>
    </form>
  `
})

export class CsvSourceComponent {
  csvForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly sourceService: SourceService) {
    this.csvForm = this.fb.group({
      file_path: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.csvForm.valid) {
      this.sourceService.addSource({ ...this.csvForm.value, type: 'csv' }).subscribe({
        next: (response) => {
          console.log('Source added:', response);
        },
        error: (err) => {
          console.error('Error adding source:', err);
        },
      });
    }
  }
}
