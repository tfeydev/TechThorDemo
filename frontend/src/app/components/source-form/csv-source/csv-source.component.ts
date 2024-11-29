import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-csv-source',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './csv-source.component.html',
  styleUrls: ['./csv-source.component.scss'],
})
export class CsvSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

  sourceData = {
    type: 'csv',
    filePath: '',
    delimiter: ',',
  };

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }
}
