import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-yaml-dialog',
  templateUrl: './edit-yaml-dialog.compontent.html',
  styleUrls: ['./edit-yaml-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule],
})
export class EditYamlDialogComponent {
  yamlData: string;

  constructor(
    public dialogRef: MatDialogRef<EditYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.yamlData = JSON.stringify(data.yamlData, null, 2);
  }

  save(): void {
    try {
      const parsedYaml = JSON.parse(this.yamlData); // Überprüfen, ob JSON gültig ist
      this.dialogRef.close(parsedYaml); // Geänderte Daten zurückgeben
    } catch (e) {
      alert('Ungültiges YAML-Format. Bitte überprüfen Sie die Eingabe.');
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
