import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-api-source',
  templateUrl: './api-source.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ApiSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

  sourceData = {
    name: '',
    type: 'api',
    url: '',
    headers: {},
    params: {}
  };

  onNameChange(value: string): void {
    this.sourceData.name = value;
    this.dataChange.emit(this.sourceData);
  }

  onFilePathChange(value: string): void {
    this.sourceData.url = value;
    this.dataChange.emit(this.sourceData);
  }

  onHeadersChange(value: string): void {
    this.sourceData.headers = value;
    this.dataChange.emit(this.sourceData);
  }

  onParamsChange(value: string): void {
    this.sourceData.params = value;
    this.dataChange.emit(this.sourceData);
  }

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }
}
