import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule
  ],
  templateUrl: './json-source.component.html'
})
export class JsonSourceComponent {
  @Output() dataChange = new EventEmitter<any>();
  showValidationErrors = false;

  sourceData = {
    name: '',
    type: 'json',
    source_type: 'local',
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
      !!this.sourceData.name && // Name must not be empty
      this.sourceData.name.length >= 3 &&
      !!this.sourceData.file_path && // File path must not be empty
      this.isValidFilePath(this.sourceData.file_path, this.sourceData.source_type) &&
      !!this.sourceData.encoding && // Encoding must not be empty
      this.isValidEncoding(this.sourceData.encoding);

    this.showValidationErrors = !isValid; // Show errors if validation fails
    return isValid;
  } 
  
  isValidFilePath(filePath: string, sourceType: string): boolean {
    switch (sourceType) {
      case 'local':
        return filePath.endsWith('.json');
      case 'gdrive':
        return filePath.startsWith('gdrive://');
      case 'onedrive':
        return filePath.startsWith('onedrive://');
      case 'smb':
        return filePath.startsWith('smb://');
      default:
        return false;
    }
  }
  
  isValidEncoding(encoding: string): boolean {
    const validEncodings = ['utf-8', 'ascii', 'latin1'];
    return validEncodings.includes(encoding.toLowerCase());
  }
  
}
