import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-api-source',
    templateUrl: './api-source.component.html',
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule
    ]
})
export class ApiSourceComponent {
  @Output() dataChange = new EventEmitter<any>();
  showValidationErrors = false;

  sourceData = {
    name: '',
    type: 'api',
    url: '',
    method: 'GET',
    headers: '{}', // Default empty JSON string
    params: '{}' // Default empty JSON string
  };

  onDataChange(): void {
    try {
      // Validate and parse headers and params
      const parsedHeaders = this.sourceData.headers ? JSON.parse(this.sourceData.headers) : {};
      const parsedParams = this.sourceData.params ? JSON.parse(this.sourceData.params) : {};

      // Ensure headers and params are valid objects
      if (typeof parsedHeaders !== 'object' || typeof parsedParams !== 'object') {
        throw new Error('Headers and Parameters must be valid JSON objects.');
      }

      const isValid =
        !!this.sourceData.name &&
        this.sourceData.name.length >= 3 &&
        !!this.sourceData.url &&
        this.isValidURL(this.sourceData.url);

      this.showValidationErrors = !isValid;

      // Emit valid data
      if (isValid) {
        this.dataChange.emit({
          ...this.sourceData,
          headers: parsedHeaders,
          params: parsedParams,
          isValid, // Inform the parent about validity
        });
      }
    } catch (error) {
      console.error('Invalid JSON in headers or parameters:', error);
      this.showValidationErrors = true; // Trigger validation errors
    }
  }

  validateFields(): boolean {
    const isValid =
      !!this.sourceData.name &&
      this.sourceData.name.length >= 3 &&
      !!this.sourceData.url &&
      this.isValidURL(this.sourceData.url) &&
      (!this.sourceData.headers || this.isValidJSON(this.sourceData.headers)) &&
      (!this.sourceData.params || this.isValidJSON(this.sourceData.params));

    this.showValidationErrors = !isValid;
    return isValid;
  }

  isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidJSON(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  }
}
