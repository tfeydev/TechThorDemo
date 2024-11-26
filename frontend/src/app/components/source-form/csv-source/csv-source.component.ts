import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-csv-source',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './csv-source.component.html',
  styleUrls: ['./csv-source.component.scss'],
})
export class CsvSourceComponent {
  csvForm; 

  constructor(private fb: FormBuilder) {
    this.csvForm = this.fb.group({
      file_path: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.csvForm.valid) {
      console.log('CSV Source:', this.csvForm.value);
    }
  }
}
