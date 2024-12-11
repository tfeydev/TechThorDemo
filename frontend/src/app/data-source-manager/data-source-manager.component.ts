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
    ]
})
export class DataSourceManagerComponent implements OnInit {
  sources: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  error: string | null = null;

  // Pagination
  length = this.sources.length
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Link Paginator
  @ViewChild(MatSort) sort!: MatSort; // Link Sort

  constructor(private sourceService: SourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSources();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Link Sort to Data Source
  }

  loadSources(): void {
    this.loading = true;
    this.sourceService.loadSources();
    this.sourceService.sources$.subscribe({
      next: (sources) => {
        this.sources = sources;

        // Update data source
        this.dataSource.data = sources;
        this.length = sources.length; // Update paginator length
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sources. Please try again later.';
        this.loading = false;
      },
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page
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
