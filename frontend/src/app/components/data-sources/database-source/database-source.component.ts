import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-database-source',
  templateUrl: './database-source.component.html',
  styleUrls: ['./database-source.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class DatabaseSourceComponent {
  @Output() dataChange = new EventEmitter<any>();

  sourceData = {
    name: '',
    type: 'database',
    db_type: '', // e.g., MySQL, PostgreSQL
    host: '',
    port: '',
    user: '',
    password: '',
    db_name: '',
    options: '{}', // Additional connection options
    tables: [] as string[], // Explicitly declare as an array of strings
    queries: [] as { name: string; query: string }[], // Explicitly declare as an array of objects
  };

  newTable = ''; // Temporary field for adding tables
  newQuery = { name: '', query: '' }; // Temporary object for adding queries

  onDataChange(): void {
    try {
      // Validate and parse options
      const parsedOptions = this.sourceData.options ? JSON.parse(this.sourceData.options) : {};

      if (typeof parsedOptions !== 'object') {
        throw new Error('Options must be a valid JSON object.');
      }

      this.dataChange.emit({
        ...this.sourceData,
        options: parsedOptions,
      });
    } catch (error) {
      console.error('Invalid JSON format for options:', error);
    }
  }

  addTable(): void {
    if (this.newTable && !this.sourceData.tables.includes(this.newTable)) {
      this.sourceData.tables.push(this.newTable);
      this.newTable = ''; // Clear input field
      this.onDataChange();
    }
  }

  removeTable(table: string): void {
    this.sourceData.tables = this.sourceData.tables.filter((t) => t !== table);
    this.onDataChange();
  }

  addQuery(): void {
    if (this.newQuery.name && this.newQuery.query) {
      this.sourceData.queries.push({ ...this.newQuery });
      this.newQuery = { name: '', query: '' }; // Clear input fields
      this.onDataChange();
    }
  }

  removeQuery(query: { name: string; query: string }): void {
    this.sourceData.queries = this.sourceData.queries.filter((q) => q !== query);
    this.onDataChange();
  }

  save(): void {
    console.log('Final Source Data:', this.sourceData);
  }

  cancel(): void {
    console.log('Cancelled');
  }
  
}
