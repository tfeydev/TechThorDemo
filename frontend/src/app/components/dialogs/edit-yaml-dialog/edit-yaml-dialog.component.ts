import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-yaml-dialog',
  templateUrl: './edit-yaml-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule],
  styleUrls: ['./edit-yaml-dialog.component.scss'],
})
export class EditYamlDialogComponent {
  yamlData: string;

  constructor(
    public dialogRef: MatDialogRef<EditYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.yamlData = data.yamlData; // Initialize the text area with the existing YAML
  }

  save(): void {
    this.dialogRef.close({ updatedYaml: this.yamlData });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
