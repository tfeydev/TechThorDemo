import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { SourceService } from '../../services/source.service';
import { CommonModule } from '@angular/common';
import { EditSourceDialogComponent } from '../edit-source-dialog/edit-source-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule 
  ]
})
export class DashboardComponent {
  sources: any[] = [];
  loadedData: any;
  loading = false;
  error = '';

  constructor(private sourceService: SourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchSources();
  }

  fetchSources(): void {
    this.loading = true;
    this.sourceService.getSources().subscribe({
      next: (data) => {
        this.sources = data.sources || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sources.';
        this.loading = false;
      },
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.sourceService.loadData().subscribe({
      next: (data) => {
        this.loadedData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load data.';
        this.loading = false;
      },
    });
  }

  editSource(source: any): void {
    const dialogRef = this.dialog.open(EditSourceDialogComponent, {
      width: '400px',
      data: { source },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.editSource(result).subscribe(() => this.fetchSources());
      }
    });
  }

  deleteSource(source: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { source },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sourceService.deleteSource(source).subscribe(() => this.fetchSources());
      }
    });
  }

  confirmDelete(sourceName: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSource(sourceName); // Proceed with deletion if confirmed
      }
    });
  }
}