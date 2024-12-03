import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { dump } from 'js-yaml';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-yaml-dialog',
  standalone: true,
  templateUrl: './view-yaml-dialog.component.html',
  styleUrls: ['./view-yaml-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ViewYamlDialogComponent {
  yamlContent: string;

  constructor(
    public dialogRef: MatDialogRef<ViewYamlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sources: any[] }
  ) {
    this.yamlContent = dump(data.sources);
  }

  close(): void {
    this.dialogRef.close();
  }
}
