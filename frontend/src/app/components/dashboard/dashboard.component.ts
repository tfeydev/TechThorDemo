import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
  ],
})
export class DashboardComponent {
  sources: any[] = []; // List of sources
  totalSources: number = 0; // Total number of sources
  pageSize: number = 5; // Items per page
  currentPage: number = 0; // Current page index
  loading = false; // Loading state
  error: string | null = null; // Error state
  loadedData: any = null; // Data loaded from the backend

  confirmDelete = false; // Added this property to manage delete confirmation
  displayedColumns: string[] = ['name', 'type', 'actions']; // Added displayedColumns for mat-table

  constructor(private sourceService: SourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchSources();
  }

  fetchSources(): void {
    this.loading = true;
    this.error = null;

    this.sourceService.getSources().subscribe({
      next: (data) => {
        this.sources = data.sources || [];
        this.totalSources = this.sources.length;
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
    this.error = null;

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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateVisibleSources();
  }

  updateVisibleSources(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.sources = this.sources.slice(start, end);
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

  confirmDeleteSource(sourceName: string): void {
    this.confirmDelete = true;
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { name: sourceName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSource(sourceName);
      }
    });
  }
}
