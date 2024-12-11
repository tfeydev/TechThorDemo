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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
        MatSelectModule,
        MatOptionModule,
    ]
})
export class DataSourceManagerComponent implements OnInit {
  sources: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  error: string | null = null;

  selectedType: string = ''; // Holds the selected filter type
  availableTypes: string[] = []; // Holds unique types for the dropdown

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
    this.dataSource.sort = this.sort;
  }

  loadSources(): void {
    this.loading = true;
  
    this.sourceService.loadSources();
    this.sourceService.sources$.subscribe({
      next: (sources) => {
        this.sources = sources;
  
        // Update data source
        this.dataSource.data = sources;
  
        // Generate unique types for the dropdown
        this.availableTypes = Array.from(new Set(sources.map((s) => s.type)));
  
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

  filterPredicate(data: any, filter: string): boolean {
    const matchesName = data.name.toLowerCase().includes(filter);
    const matchesType = !this.selectedType || data.type === this.selectedType;

    return matchesName && matchesType;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = this.filterPredicate.bind(this);
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  filterByType(): void {
    // Filter rows by selected type
    this.dataSource.filterPredicate = (data, filter) => {
      return !this.selectedType || data.type === this.selectedType;
    };
    this.dataSource.filter = this.selectedType; // Trigger filtering

    // Reset pagination after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
