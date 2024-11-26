import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-database-source',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './database-source.component.html',
  styleUrls: ['./database-source.component.scss'],
})
export class DatabaseSourceComponent {
  databaseForm; // Form group declaration

  constructor(private readonly fb: FormBuilder) {
    this.databaseForm = this.fb.group({
      db_type: ['', Validators.required],
      host: ['', Validators.required],
      port: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      user: ['', Validators.required],
      password: ['', Validators.required],
      dbname: ['', Validators.required],
      tables: ['', Validators.required], // Allow adding multiple tables dynamically in the future
    });
  }

  onSubmit(): void {
    if (this.databaseForm.valid) {
      console.log('Database Form Data:', this.databaseForm.value);
    }
  }
}
