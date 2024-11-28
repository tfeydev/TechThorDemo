import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Service for managing table data
import { MatDialog } from '@angular/material/dialog'; // Service for dialog
import { SourceService } from '../../services/source.service';
import { EditSourceDialogComponent } from '../dialogs/edit-source-dialog/edit-source-dialog.component';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  sources: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'type', 'actions'];

  constructor(
    private readonly sourceService: SourceService, 
    private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchSources();
  }

  fetchSources(): void {
    this.loading = true;
    this.sourceService.getSources().subscribe({
      next: (data) => {
        this.sources = data.sources || [];
        this.dataSource.data = this.sources;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sources.';
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
        this.sourceService.deleteSource(source.name).subscribe(() => this.fetchSources());
      }
    });
  }
}
