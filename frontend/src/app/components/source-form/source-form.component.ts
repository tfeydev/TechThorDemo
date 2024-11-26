import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { CsvSourceComponent } from './csv-source/csv-source.component';
import { JsonSourceComponent } from './json-source/json-source.component';
import { ApiSourceComponent } from "./api-source/api-source.component";
import { DatabaseSourceComponent } from './database-source/database-source.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-source-form',
  standalone: true,
  imports: [ 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule, 
    NgIf, 
    CsvSourceComponent, 
    JsonSourceComponent, 
    ApiSourceComponent, 
    DatabaseSourceComponent
  ],
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.scss'],
})
export class SourceFormComponent {
  sourceType = 'select';

  onTypeChange(event: any): void {
    this.sourceType = event.value; // Use 'value' instead of 'target.value'
    console.log('Selected Type:', this.sourceType);
  }
}
