import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SourceService } from '../services/source.service';
import { AddSourceDialogComponent } from '../components/dialogs/add-source-dialog/add-source-dialog.component';
import { UpdateSourceDialogComponent } from '../components/dialogs/update-source-dialog/update-source-dialog.component';
import { ConfirmDeleteDialogComponent } from '../components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ViewYamlDialogComponent } from '../components/dialogs/view-yaml-dialog/view-yaml-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './data-source-manager.component.html',
  styleUrls: ['./data-source-manager.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
})
export class DataSourceManagerComponent implements OnInit {
  sources: any[] = [];
  totalItems = 0;
  pageSize = 5; // Default page size
  currentPage = 0; // Start on the first page
  sortField = 'name';
  sortDirection = 'asc';
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  error: string | null = null;

  private currentPageIndex: number = 0;

  setPageIndex(index: number): void {
    this.currentPageIndex = index;
  }

  getPageIndex(): number {
    return this.currentPageIndex;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private sourceService: SourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources(): void {
    this.loading = true;
  
    this.sourceService.loadSources();
    this.sourceService.sources$.subscribe({
      next: (sources) => {
        this.sources = sources;
  
        // Track current page index to preserve it
        const previousIndex = this.paginator ? this.paginator.pageIndex : this.currentPageIndex;
  
        // Update data source
        this.dataSource = new MatTableDataSource(sources);
  
        // Attach paginator and sort
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageIndex = previousIndex; // Restore the page index
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
  
        // Update currentPageIndex to persist state
        this.currentPageIndex = previousIndex;
  
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sources. Please try again later.';
        this.loading = false;
      },
    });
  }  

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSources();
  }

  onSortChange(event: any): void {
    this.sortField = event.active;
    this.sortDirection = event.direction;
    this.loadSources();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    // Retain the current page index when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = this.currentPageIndex;
    }
  }
  
  openAddSourceDialog(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.addSource(result);
      }
    });
  }

  openUpdateSourceDialog(name: string): void {
    const source = this.sources.find((s) => s.name === name);
    if (!source) {
      return;
    }
    const dialogRef = this.dialog.open(UpdateSourceDialogComponent, {
      width: '600px',
      height: '450px',
      data: { source },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.updateSource(name, result);
      }
    });
  }

  openDeleteDialog(name: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sourceService.deleteSource(name);
      }
    });
  }

  viewYaml(): void {
    this.dialog.open(ViewYamlDialogComponent, { width: '800px', data: { sources: this.sources } });
  }
}
