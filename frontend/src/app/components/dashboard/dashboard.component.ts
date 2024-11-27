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
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ViewYamlDialogComponent } from '../dialogs/view-yaml-dialog/view-yaml-dialog.component';
import { Router } from '@angular/router';
import { EditYamlDialogComponent } from '../dialogs/edit-yaml-dialog/edit-yaml-dialog.component';


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
    MatTableModule
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

  constructor(
    private sourceService: SourceService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

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

  viewYaml(source: any): void {
    // Open the View YAML dialog
    const dialogRef = this.dialog.open(ViewYamlDialogComponent, {
      width: '400px',
      data: { source },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.viewData) {
        this.router.navigate(['/data', source.name]); // Use Router to navigate
      }
    });
  }

  editYaml(source: any): void {
    const dialogRef = this.dialog.open(EditYamlDialogComponent, {
      width: '500px',
      data: { yamlData: JSON.stringify(source, null, 2) }, // Convert the source to YAML-like JSON
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updatedYaml) {
        try {
          const updatedSource = JSON.parse(result.updatedYaml); // Convert back to JSON
          // Call a service to update the YAML file on the backend
          this.sourceService.updateSource(updatedSource).subscribe(() => {
            this.fetchSources(); // Refresh the list
          });
        } catch (e) {
          console.error('Invalid YAML format', e);
        }
      }
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

  viewSourceConfig(source: any): void {
    const dialogRef = this.dialog.open(ViewYamlDialogComponent, {
      width: '500px',
      data: { source },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.viewData) {
        // Navigate to /data/... when "Load Data" is clicked in the dialog
        this.router.navigateByUrl(`/data/${source.name}`);
      }
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


  deleteSource(source: any): void {
    if (!source.name) {
      console.error('Source name is missing!');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { sourceName: source.name }, // Ensure you pass the name
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sourceService.deleteSource(source.name).subscribe({
          next: () => {
            this.fetchSources(); // Refresh the list after deletion
          },
          error: (err) => {
            console.error('Failed to delete source:', err);
          },
        });
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
