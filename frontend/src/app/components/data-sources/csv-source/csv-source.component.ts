import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-csv-source',
  templateUrl: './csv-source.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule
  ],
})

export class CsvSourceComponent {
  @Output() dataChange = new EventEmitter<any>();
  showValidationErrors = false; 

  sourceData = {
    name: '',
    type: 'csv',
    file_source_type: 'local',
    file_path: '',
    delimiter: ',',
    encoding: 'utf-8'
  };

  onNameChange(value: string): void {
    this.sourceData.name = value;
    this.dataChange.emit(this.sourceData);
  }

  onFileSourceTypeChange(value: string): void {
    this.sourceData.file_source_type = value;
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
      !!this.sourceData.name && // Name must not be empty
      this.sourceData.name.length >= 3 &&
      !!this.sourceData.file_path && // File path must not be empty
      this.isValidFilePath(this.sourceData.file_path, this.sourceData.file_source_type) &&
      !!this.sourceData.delimiter && // Delimiter must not be empty
      this.isValidCSVDelimiter(this.sourceData.delimiter) &&
      !!this.sourceData.encoding && // Encoding must not be empty
      this.isValidEncoding(this.sourceData.encoding);

    this.showValidationErrors = !isValid; // Show errors if validation fails
    return isValid;
  }

  isValidFilePath(file_path: string, file_source_type: string): boolean {
    if (!file_path) {
      return false; // File path must not be empty
    }
  
    // Define valid starts for each source type
    const validStarts: Record<string, (file_path: string) => boolean> = {
      local: () => true, // Local files don't need a specific prefix
      gdrive: (file_path) => file_path.startsWith('gdrive://'),
      onedrive: (file_path) => file_path.startsWith('onedrive://'),
      smb: (file_path) => file_path.startsWith('smb://') || file_path.startsWith('\\'),
      html: (file_path) => file_path.startsWith('http://') || file_path.startsWith('https://'),
    };
  
    // Check if file path starts correctly and ends with `.csv`
    const startsValid = validStarts[file_source_type]?.(file_path) ?? false;
    const endsWithCSV = file_path.endsWith('.csv');

    return startsValid && endsWithCSV;
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