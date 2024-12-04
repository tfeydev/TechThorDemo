import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CsvSourceComponent } from '../../data-sources/csv-source/csv-source.component';
import { JsonSourceComponent } from '../../data-sources/json-source/json-source.component';
import { ApiSourceComponent } from '../../data-sources/api-source/api-source.component';
import { DatabaseSourceComponent } from '../../data-sources/database-source/database-source.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-source-dialog',
  standalone: true,
  templateUrl: './add-source-dialog.component.html',
  styleUrls: ['./add-source-dialog.component.scss'],
  imports: [
    CsvSourceComponent,
    JsonSourceComponent,
    ApiSourceComponent,
    DatabaseSourceComponent,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class AddSourceDialogComponent {
  selectedSourceType: string = ''; // Default no selection
  sourceData: any = {}; // Data collected from child components
  isFormValid: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddSourceDialogComponent>) {}

  onDataChange(data: any): void {
    this.sourceData = { ...data, file_path: data.filePath }; // Adjust key as needed
    delete this.sourceData.filePath; // Remove old key if necessary
    this.isFormValid = this.validateForm(this.sourceData);
  }


  validateForm(data: any): boolean {
    return !!data && Object.keys(data).length > 0; // Basic validation
  }

  save(): void {
    const payload = {
      type: this.selectedSourceType,
      ...this.sourceData,
    };
  
    // Remove empty fields
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== null && value !== '')
    );
  
    console.log('Payload sent to backend:', cleanedPayload); // Debugging
    this.dialogRef.close(cleanedPayload);
  }
  
  cleanPayload(payload: any): any {
    return Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== null && v !== undefined)
    );
  }

  cancel(): void {
    this.dialogRef.close(null); // Close dialog without saving
  }
}