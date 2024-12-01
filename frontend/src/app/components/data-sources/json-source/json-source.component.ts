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
    filePath: ''
  };

  
  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }

}
