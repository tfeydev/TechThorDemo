import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
    selector: 'app-monitoring',
    templateUrl: './monitoring.component.html',
    styleUrls: ['./monitoring.component.scss'],
    imports: [
        MatCardModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        FormsModule,
        CommonModule,
        RouterModule,
        RouterOutlet,
        MatTabsModule
    ]
})
export class MonitoringComponent implements OnInit {
  sources: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSourceStatuses();
  }

  loadSourceStatuses(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getSourceStatuses().subscribe({
      next: (data) => {
        this.sources = data; // Assign data from API response
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching source statuses:', err);
        this.error = 'Failed to load source statuses.';
        this.loading = false;
      },
    });
  }
}
