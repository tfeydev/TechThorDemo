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
    table: '', // Single table
    query: { name: '', query: '' }, // Single query
    tables: [] as string[], // Optional: Additional tables
    queries: [] as { name: string; query: string }[], // Optional: Additional queries
  };

  onDataChange(): void {
    this.dataChange.emit(this.sourceData);
  }

  addTable(): void {
    if (this.sourceData.table) {
      this.sourceData.tables.push(this.sourceData.table);
      this.sourceData.table = ''; // Clear input field
      this.onDataChange();
    }
  }

  removeTable(index: number): void {
    this.sourceData.tables.splice(index, 1); // Remove by index
    this.onDataChange();
  }

  addQuery(): void {
    if (this.sourceData.query?.name && this.sourceData.query?.query) {
      this.sourceData.queries.push({ ...this.sourceData.query });
      this.sourceData.query = { name: '', query: '' }; // Reset input fields
      this.onDataChange();
    }
  }

  removeQuery(index: number): void {
    this.sourceData.queries.splice(index, 1); // Remove by index
    this.onDataChange();
  }

  save(): void {
    console.log('Final Source Data:', this.sourceData);
  }
}  