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
  selectedSourceType: string = ''; // Selected source type
  selectedFileSourceType: string = '';
  sourceData: any = {}; // Data collected from child components
  isFormValid: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddSourceDialogComponent>) {}

  onDataChange(data: any): void {
    // Ensure the sourceData reflects updates from the child components
    this.sourceData = { ...data };

    this.selectedFileSourceType = data.file_source_type || 'local';

    // Validate the form based on source type and required fields
    this.isFormValid = data.isValid;
  }

  validateForm(data: any): boolean {
    // Add specific validation for source types if needed
    return !!data && Object.keys(data).length > 0; // Basic validation: Non-empty data
  }

  save(): void {
    const payload = {
      type: this.selectedSourceType,
      file_source_type: this.selectedFileSourceType,
      ...this.sourceData,
    };
  
    // Handle specific processing for API sources
    if (this.selectedSourceType === 'api') {
      // Ensure headers and params are correctly parsed as JSON objects
      try {
        payload.headers = payload.headers ? JSON.parse(payload.headers) : {};
      } catch (e) {
        console.error('Invalid headers JSON:', e);
        payload.headers = {};
      }
  
      try {
        payload.params = payload.params ? JSON.parse(payload.params) : {};
      } catch (e) {
        console.error('Invalid params JSON:', e);
        payload.params = {};
      }
    }
  
    // Remove empty fields (including empty objects and arrays)
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => 
        value !== null && 
        value !== undefined && 
        (typeof value === 'object' ? Object.keys(value).length > 0 : value !== '')
      )
    );
  
    console.log('Payload sent to backend:', cleanedPayload); // Debugging
    this.dialogRef.close(cleanedPayload); // Close dialog with the payload
  }  
  
  cancel(): void {
    this.dialogRef.close(null); // Close dialog without saving
  }
}
