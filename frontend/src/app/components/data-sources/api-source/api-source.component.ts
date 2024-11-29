import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { apiUrlValidator } from '../../../utils/validators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-api-source',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    
  `,
})
export class ApiSourceComponent {
  apiForm; 

  constructor(private readonly fb: FormBuilder) {
    this.apiForm = this.fb.group({
        url: ['', [Validators.required, apiUrlValidator]],
      });
  }

  onSubmit() {
    if (this.apiForm.valid) {
      console.log(this.apiForm.value);
    }
  }
}
