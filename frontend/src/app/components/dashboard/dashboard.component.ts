import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SourceService } from '../../services/source.service';
import { AddSourceDialogComponent } from '../dialogs/add-source-dialog/add-source-dialog.component';
import { UpdateSourceDialogComponent } from '../dialogs/update-source-dialog/update-source-dialog.component';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ViewYamlDialogComponent } from '../dialogs/view-yaml-dialog/view-yaml-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ]
})
export class DashboardComponent implements OnInit {
  sources: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>();
  loading = false;
  error: string | null = null;

  constructor(private sourceService: SourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSources();
  }

  // Load sources from the backend
  loadSources(): void {
    this.loading = true;
    this.error = null;

    this.sourceService.loadSources();
    this.sourceService.sources$.subscribe({
      next: (sources) => {
        this.sources = sources;
        this.dataSource.data = sources;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sources. Please try again later.';
        this.loading = false;
      },
    });
  }

  // Open the Add Source Dialog
  openAddSourceDialog(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, { width: '500px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.addSource(result);
      }
    });
  }

  // Open the Update Source Dialog
  openUpdateSourceDialog(name: string): void {
    const source = this.sources.find((s) => s.name === name);
    const dialogRef = this.dialog.open(UpdateSourceDialogComponent, { width: '500px', data: source });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sourceService.updateSource(name, result);
      }
    });
  }

  // Open the Delete Confirmation Dialog
  openDeleteDialog(name: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, { width: '400px', data: { name } });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sourceService.deleteSource(name);
      }
    });
  }

  // Open the View YAML Dialog
  viewYaml(): void {
    this.dialog.open(ViewYamlDialogComponent, { width: '800px', data: { sources: this.sources } });
  }
}
