import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-api-source',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './api-source.component.html',
  styleUrls: ['./api-source.component.scss'],
})
export class ApiSourceComponent {
  apiForm; 

  constructor(private fb: FormBuilder) {
    this.apiForm= this.fb.group({
      url: ['', Validators.required],
      headers: ['', this.jsonValidator],
      params: ['', this.jsonValidator],
    });
  
  }

  onSubmit() {
    if (this.apiForm.valid) {
      console.log('API Source:', this.apiForm.value);
    }
  }

  jsonValidator(control: AbstractControl) {
    try {
      if (control.value) {
        JSON.parse(control.value);
      }
      return null; // valid JSON
    } catch {
      return { invalidJson: true }; // invalid JSON
    }
  }
}
