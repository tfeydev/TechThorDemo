import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { YamlService } from '../../../services/yaml.service';
import { EditYamlDialogComponent } from '../edit-yaml-dialog/edit-yaml-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-yaml-dialog',
  templateUrl: './view-yaml-dialog.component.html',
  styleUrls: ['./view-yaml-dialog.component.scss'],
  imports: [ CommonModule, MatDialogModule, MatButtonModule]
})
export class ViewYamlDialogComponent {
  yamlData: any;

  constructor(
    public dialogRef: MatDialogRef<ViewYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly yamlService: YamlService,
    private readonly dialog: MatDialog
  ) {
    this.yamlData = data.yamlData; // YAML-Daten initialisieren
  }

  editYaml(): void {
    const dialogRef = this.dialog.open(EditYamlDialogComponent, {
      width: '600px',
      data: { yamlData: this.yamlData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.yamlService.updateYaml(result).subscribe({
          next: () => {
            this.yamlData = result; // Aktualisierte Daten anzeigen
          },
          error: () => {
            alert('Fehler beim Speichern der Änderungen.');
          },
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
