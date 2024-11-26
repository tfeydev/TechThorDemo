import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { csvFilePathValidator } from '../../../utils/validators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-csv-source',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="csvForm" (ngSubmit)="onSubmit()">
      <label for="filePath">CSV File Path</label>
      <input id="filePath" formControlName="filePath" />
      <div *ngIf="csvForm.get('filePath')?.errors?.['invalidFilePath']">
        {{ csvForm.get('filePath')?.errors?.['invalidFilePath'] }}
      </div>
      <button type="submit" [disabled]="csvForm.invalid">Submit</button>
    </form>
  `,
})
export class CsvSourceComponent {
  csvForm; 

  constructor(private readonly fb: FormBuilder) {
    this.csvForm = this.fb.group({
        filePath: ['', [Validators.required, csvFilePathValidator]],
      });
  }

  onSubmit() {
    if (this.csvForm.valid) {
      console.log(this.csvForm.value);
    }
  }
}
