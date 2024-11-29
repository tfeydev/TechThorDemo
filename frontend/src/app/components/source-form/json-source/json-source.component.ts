import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-json-source',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './json-source.component.html',
  styleUrls: ['./json-source.component.scss'],
})
export class JsonSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

  sourceData = {
    type: 'json',
    filePath: '',
  };

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }
}
