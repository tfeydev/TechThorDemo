import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { CsvSourceComponent } from '../components/data-sources/csv-source/csv-source.component';
import { JsonSourceComponent } from '../components/data-sources/json-source/json-source.component';
import { ApiSourceComponent } from '../components/data-sources/api-source/api-source.component';
import { DatabaseSourceComponent } from '../components/data-sources/database-source/database-source.component';
import { ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-source-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CsvSourceComponent,
    JsonSourceComponent,
    ApiSourceComponent,
    DatabaseSourceComponent,
  ],
  template: `
    <form>
      <label for="type">Source Type</label>
      <select id="type" (change)="onTypeChange($event)">
        <option value="select">Select</option>
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
        <option value="api">API</option>
        <option value="database">Database</option>
      </select>

      <ng-container *ngIf="sourceType === 'select'">
        <p>Please select a source type to begin configuring.</p>
      </ng-container>

      <app-csv-source *ngIf="sourceType === 'csv'"></app-csv-source>
      <app-json-source *ngIf="sourceType === 'json'"></app-json-source>
      <app-api-source *ngIf="sourceType === 'api'"></app-api-source>
      <app-database-source *ngIf="sourceType === 'database'"></app-database-source>
    </form>
  `,
})
export class SourceFormComponent {
  sourceType = 'select'; // Default to 'select' option

  onTypeChange(event: any): void {
    this.sourceType = event.target.value;
  }
}

/**
 * Validator to check for a valid API URL
 */
export const apiUrlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Allow empty values (optional field)
  }
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(control.value) ? null : { invalidUrl: 'The provided URL is not valid' };
};

/**
 * Validator to ensure JSON keys are properly formatted
 */
export const jsonValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Allow empty values (optional field)
  }
  try {
    JSON.parse(control.value);
    return null;
  } catch (e) {
    return { invalidJson: 'Invalid JSON format' };
  }
};

/**
 * Validator for JSON file path
 */
export const jsonFilePathValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Allow empty values (optional field)
  }
  const jsonFilePattern = /\.json$/i;
  return jsonFilePattern.test(control.value)
    ? null
    : { invalidFilePath: 'The file path must point to a .json file' };
};

/**
 * Validator for CSV file path
 */
export const csvFilePathValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Allow empty values (optional field)
  }
  const csvFilePattern = /\.csv$/i;
  return csvFilePattern.test(control.value)
    ? null
    : { invalidFilePath: 'The file path must point to a .csv file' };
};

/**
 * Validator for database connection fields
 */
export const databaseConnectionValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const requiredFields = ['host', 'port', 'user', 'password', 'dbname'];
  const errors: ValidationErrors = {};

  requiredFields.forEach((field) => {
    if (!group.get(field)?.value) {
      errors[field] = `${field} is required`;
    }
  });

  return Object.keys(errors).length ? errors : null;
};
