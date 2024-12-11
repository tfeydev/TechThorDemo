import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceService } from '../../services/source.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-data-viewer',
    imports: [MatDialogModule, MatButtonModule, CommonModule, JsonPipe],
    template: `
    <h2>Data for {{ sourceName }}</h2>
    <div *ngIf="loading">Loading data...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <pre *ngIf="data">{{ data | json }}</pre>
  `
})
export class DataViewerComponent implements OnInit {
  sourceName: string = '';
  data: any;
  loading = false;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sourceService: SourceService
  ) {}

  ngOnInit(): void {
    this.sourceName = this.route.snapshot.paramMap.get('name') || '';
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.sourceService.loadDataByName(this.sourceName).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load data.';
        this.loading = false;
      },
    });
  }
}
