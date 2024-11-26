import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './json-source.component.html',
  styleUrls: ['./json-source.component.scss'],
})
export class JsonSourceComponent {
  jsonForm;

  constructor(private fb: FormBuilder) {
    this.jsonForm = this.fb.group({
      file_path: ['', Validators.required],
      keys: [''],
    });
  }

  onSubmit() {
    if (this.jsonForm.valid) {
      console.log('JSON Source:', this.jsonForm.value);
    }
  }
}
