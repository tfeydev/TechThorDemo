import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { jsonFilePathValidator, jsonValidator } from '../../../utils/validators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="jsonForm" (ngSubmit)="onSubmit()">
      <label for="filePath">JSON File Path</label>
      <input id="filePath" formControlName="filePath" />
      <div *ngIf="jsonForm.get('filePath')?.errors?.['invalidFilePath']">
        {{ jsonForm.get('filePath')?.errors?.['invalidFilePath'] }}
      </div>

      <label for="keys">JSON Keys</label>
      <input id="keys" formControlName="keys" />
      <div *ngIf="jsonForm.get('keys')?.errors?.['invalidJson']">
        {{ jsonForm.get('keys')?.errors?.['invalidJson'] }}
      </div>

      <button type="submit" [disabled]="jsonForm.invalid">Submit</button>
    </form>
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
