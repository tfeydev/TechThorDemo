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

  addSource(source: any): void {
    console.log('Sending payload to backend for addition:', source);
    this.apiService.addSource(source).subscribe(() => this.loadSources());
  }
  
  updateSource(name: string, source: any): void {
    console.log('Sending payload to backend for update:', source);
    this.apiService.updateSource(name, source).subscribe(() => this.loadSources());
  } 

  // Delete a source
  deleteSource(name: string): void {
    this.apiService.deleteSource(name).subscribe(() => this.loadSources());
  }
  
}
