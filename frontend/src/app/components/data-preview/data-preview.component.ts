import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-data-preview',
    templateUrl: './data-preview.component.html',
    styleUrls: ['./data-preview.component.scss'],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatMenuModule,
        RouterModule,
        MatCardModule
    ]
})
export class DataPreviewComponent implements OnInit {
  sourceName: string = '';
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const sourceName = params.get('sourceName');
      if (sourceName) {
        this.apiService.getDataPreview(sourceName).subscribe(
          (response: any) => {
            this.sourceName = sourceName;
  
            if (response.preview.length > 0) {
              this.displayedColumns = Object.keys(response.preview[0]);
              this.dataSource = response.preview;
            } else {
              this.displayedColumns = [];
              this.dataSource = [];
            }
          },
          (error: any) => console.error('Error loading data preview:', error)
        );
      }
    });
  }  

  loadPreview(): void {
    this.apiService.getDataPreview(this.sourceName).subscribe(
      (response) => {
        if (response.preview.length) {
          this.displayedColumns = Object.keys(response.preview[0]);
          this.dataSource = response.preview;
        }
      },
      (error) => console.error('Error loading data preview:', error)
    );
  }
}
