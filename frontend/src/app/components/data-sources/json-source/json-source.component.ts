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
    this.dataChange.emit(this.sourceData);
  }

}
