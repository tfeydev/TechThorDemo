import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-view-yaml-dialog',
    templateUrl: './view-yaml-dialog.component.html',
    styleUrls: ['./view-yaml-dialog.component.scss'],
    imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class ViewYamlDialogComponent {
  jsonContent: string;

  constructor(
    public dialogRef: MatDialogRef<ViewYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sources: any[] }
  ) {
    // Convert the data to pretty JSON format
    this.jsonContent = JSON.stringify(data.sources, null, 2);
  }

  close(): void {
    this.dialogRef.close();
  }
}
