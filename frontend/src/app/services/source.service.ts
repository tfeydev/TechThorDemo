
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SourceService {
  private readonly baseUrl = 'http://127.0.0.1:8000/data';

  constructor(private readonly http: HttpClient) {}

  // Fetch all sources
  getSources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sources`).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch a single source by name
  getSource(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-source/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  getSourceByName(sourceName: string): Observable<any> {
    return this.getSource(sourceName); // Reuse the existing `getSource` method
  }
  

  // Add a new source
  addSource(source: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/data/add-source`, source).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing source
  updateSource(source: any, originalName: string): Observable<any> {
    console.log('Updating source:', originalName, 'Payload:', source); // Debugging
    return this.http.put(`${this.baseUrl}/update-source/${originalName}`, source).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a source by name
  deleteSource(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-source/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Debugging
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
