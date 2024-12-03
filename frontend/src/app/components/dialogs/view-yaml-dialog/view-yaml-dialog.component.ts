import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { YamlService } from '../../../services/yaml.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-yaml-dialog',
  standalone: true,
  templateUrl: './view-yaml-dialog.component.html',
  styleUrls: ['./view-yaml-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ViewYamlDialogComponent {
  yamlData: any;

  constructor(
    public dialogRef: MatDialogRef<ViewYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { yamlData: any },
    private readonly yamlService: YamlService,
    private readonly dialog: MatDialog
  ) {
    this.yamlData = data.yamlData; // Initialize YAML data
  }

  updateYaml(): void {
    // Directly update YAML using YamlService
    this.yamlService.updateYaml(this.yamlData).subscribe({
      next: () => {
        alert('YAML updated successfully.');
      },
      error: () => {
        alert('Error saving changes.');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
