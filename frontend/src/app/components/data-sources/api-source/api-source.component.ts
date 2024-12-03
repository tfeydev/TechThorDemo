import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-api-source',
  templateUrl: './api-source.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
})
export class ApiSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

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

      // Emit valid data
      this.dataChange.emit({
        ...this.sourceData,
        headers: parsedHeaders,
        params: parsedParams
      });
    } catch (error) {
      console.error('Invalid JSON format for headers or parameters:', error);
    }
  }
}
