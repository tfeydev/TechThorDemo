import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './json-source.component.html'
})
export class JsonSourceComponent {
  @Output() dataChange = new EventEmitter<any>();
  showValidationErrors = false;

  sourceData = {
    name: '',
    type: 'json',
    file_path: '',
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
      this.isValidJSONPath(this.sourceData.file_path) &&
      !!this.sourceData.encoding && // Convert encoding to boolean
      this.isValidEncoding(this.sourceData.encoding);
  
    this.showValidationErrors = !isValid; // Show errors if validation fails
    return isValid;
  }  
  
  isValidJSONPath(filePath: string): boolean {
    return filePath.endsWith('.json');
  }
  
  isValidEncoding(encoding: string): boolean {
    const validEncodings = ['utf-8', 'ascii', 'latin1'];
    return validEncodings.includes(encoding.toLowerCase());
  }
  
}
