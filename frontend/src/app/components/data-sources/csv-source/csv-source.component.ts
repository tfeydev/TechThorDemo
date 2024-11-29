import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SourceService } from '../../../services/source.service';
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

  sourceData = {
    name: '',
    type: 'csv',
    filePath: '',
    delimiter: ',',
  };

  onNameChange(value: string): void {
    this.sourceData.name = value;
    this.dataChange.emit(this.sourceData);
  }

  onFilePathChange(value: string): void {
    this.sourceData.filePath = value;
    this.dataChange.emit(this.sourceData);
  }

  onDelimiterChange(value: string): void {
    this.sourceData.delimiter = value;
    this.dataChange.emit(this.sourceData);
  }

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }
  
}