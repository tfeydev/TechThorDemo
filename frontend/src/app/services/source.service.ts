import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SourceService {
  private sourcesSubject = new BehaviorSubject<any[]>([]);
  sources$ = this.sourcesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Load sources and update BehaviorSubject
  loadSources(): void {
    this.apiService.getSources().subscribe((sources) => {
      this.sourcesSubject.next(sources);
    });
  }

  // Add a new source
  addSource(source: any): void {
    this.apiService.addSource(source).subscribe(() => this.loadSources());
  }

  // Update an existing source
  updateSource(name: string, source: any): void {
    this.apiService.updateSource(name, source).subscribe(() => this.loadSources());
  }

  // Delete a source
  deleteSource(name: string): void {
    this.apiService.deleteSource(name).subscribe(() => this.loadSources());
  }
}
