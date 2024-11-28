import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Service for managing table data
import { MatDialog } from '@angular/material/dialog'; // Service for dialog
import { SourceService } from '../../services/source.service';
import { UpdateSourceDialogComponent } from '../dialogs/update-source-dialog/update-source-dialog.component';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    MatProgressSpinnerModule
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
      error: (err) => {
        this.error = 'Failed to load sources.';
        console.error('Error fetching sources:', err);
        this.loading = false;
      },
    });
  }
  
  viewSource(name: string): void {
    this.sourceService.getSource(name).subscribe({
      next: (data) => {
        console.log('Source details:', data.source);
        // Optionally, display details in a dialog
      },
      error: (err) => {
        console.error(`Failed to fetch source '${name}':`, err);
      },
    });
  } 
  
  updateSource(source: any): void {
    const dialogRef = this.dialog.open(UpdateSourceDialogComponent, {
      width: '400px',
      data: { source },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.updateSource(result).subscribe({
          next: () => {
            console.log('Source updated successfully.');
            this.fetchSources();
          },
          error: (err) => {
            console.error('Failed to update source:', err);
          },
        });
      }
    });
  }  


  deleteSource(sourceName: string): void {
    this.sourceService.deleteSource(sourceName).subscribe({
      next: () => {
        console.log(`Source '${sourceName}' deleted successfully.`);
        this.fetchSources();
      },
      error: (err) => {
        console.error(`Failed to delete source '${sourceName}':`, err);
      },
    });
  }
  
}
 