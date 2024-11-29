import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { jsonFilePathValidator, jsonValidator } from '../../../utils/validators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    
  `,
})
export class JsonSourceComponent {
  jsonForm; 

  constructor(private readonly fb: FormBuilder) {
    this.jsonForm = this.fb.group({
        filePath: ['', [Validators.required, jsonFilePathValidator]],
        keys: ['', jsonValidator],
      });
  }

  onSubmit() {
    if (this.jsonForm.valid) {
      console.log(this.jsonForm.value);
    }
  }
}
