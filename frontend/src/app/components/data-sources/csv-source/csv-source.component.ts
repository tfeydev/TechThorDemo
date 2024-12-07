import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-csv-source',
  templateUrl: './csv-source.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule
  ],
})

export class CsvSourceComponent {
  @Output() dataChange = new EventEmitter<any>();
  showValidationErrors = false; 

  sourceData = {
    name: '',
    type: 'csv',
    file_path: '',
    delimiter: ',',
    encoding: 'utf-8'
  };

  onNameChange(value: string): void {
    this.sourceData.name = value;
    this.dataChange.emit(this.sourceData);
  }

  onFilePathChange(value: string): void {
    this.sourceData.file_path = value;
    this.dataChange.emit(this.sourceData);
  }

  onDelimiterChange(value: string): void {
    this.sourceData.delimiter = value;
    this.dataChange.emit(this.sourceData);
  }

  onEncodingChange(value: string): void {
    this.sourceData.encoding = value;
    this.dataChange.emit(this.sourceData);
  }

  onDataChange(): void {
    const isValid = this.validateFields();
    this.dataChange.emit({ ...this.sourceData, isValid });
  }
  
  validateFields(): boolean {
    const isValid =
      !!this.sourceData.name && // Convert name to boolean
      this.sourceData.name.length >= 3 &&
      !!this.sourceData.file_path && // Convert file_path to boolean
      this.isValidCSVPath(this.sourceData.file_path) &&
      !!this.sourceData.delimiter && // Convert delimiter to boolean
      this.isValidCSVDelimiter(this.sourceData.delimiter) &&
      !!this.sourceData.encoding && // Convert encoding to boolean
      this.isValidEncoding(this.sourceData.encoding);
  
    this.showValidationErrors = !isValid; // Show errors if validation fails
    return isValid;
  }

  // Check if file path ends with .csv
  isValidCSVPath(filePath: string): boolean {
    return filePath.endsWith('.csv');
  }

  // Check if encoding is valid
  isValidEncoding(encoding: string): boolean {
    const validEncodings = ['utf-8', 'ascii', 'latin1'];
    return validEncodings.includes(encoding.toLowerCase());
  }

  isValidCSVDelimiter(delimiter: string): boolean {
    // Check for single character delimiters (common: ',', ';', '\t', '|')
    return delimiter.length === 1 && /^[,;\t|]$/.test(delimiter);
  }
}