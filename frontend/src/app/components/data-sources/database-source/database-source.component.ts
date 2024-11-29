import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { databaseConnectionValidator } from '../../../utils/validators';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-database-source',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './database-source.component.html'
})
export class DatabaseSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

  sourceData = {
    type: 'database',
    dbType: 'postgresql',
    host: '',
    port: 5432,
    dbName: '',
    username: '',
    password: '',
  };

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }
}
