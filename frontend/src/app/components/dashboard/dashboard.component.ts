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
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddSourceDialogComponent } from '../dialogs/add-source-dialog/add-source-dialog.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('transitionMessages', [
      // Enter animation: when the element is added to the DOM
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }), // Initial state
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })), // Final state
      ]),
      // Leave animation: when the element is removed from the DOM
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' })), // Transition to this state
      ]),
    ]),
  ],
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

  addSource(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New Source Added:', result);
        this.saveSource(result); // Backend integration
      }
    });
  }

  saveSource(source: any): void {
    console.log('Payload being sent to backend:', source); // Debugging the payload
    this.sourceService.addSource(source).subscribe({
      next: () => {
        console.log('Source added successfully');
        this.fetchSources(); // Refresh source list
      },
      error: (err) => {
        console.error('Failed to add source:', err); // Debugging errors
      },
    });
  }
  

  
  updateSource(sourceName: string): void {
    // Fetch the source details
    this.sourceService.getSourceByName(sourceName).subscribe({
      next: (response) => {
        const source = response.source; // Get the source data
        console.log('Fetched source:', source);
  
        // Open the dialog and pass both the current source and its original name
        const dialogRef = this.dialog.open(UpdateSourceDialogComponent, {
          width: '400px',
          data: { source, originalName: source.name },
        });
  
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // Call the update API with the original name
            this.sourceService.updateSource(result, source.name).subscribe({
              next: () => {
                console.log('Source updated successfully.');
                this.fetchSources(); // Refresh the sources list
              },
              error: (err) => {
                console.error('Failed to update source:', err);
              },
            });
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch source details:', err);
      },
    });
  }

  deleteSource(sourceName: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { name: sourceName }, // Pass the name to the dialog
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sourceService.deleteSource(sourceName).subscribe({
          next: () => {
            console.log(`Source '${sourceName}' deleted successfully.`);
            this.fetchSources(); // Refresh the list
          },
          error: (err) => {
            console.error(`Failed to delete source '${sourceName}':`, err);
          },
        });
      } else {
        console.log(`Deletion of source '${sourceName}' was cancelled.`);
      }
    });
  }  
  
}  
 