import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SourceService {
  private readonly baseUrl = 'http://127.0.0.1:8000/data';

  constructor(private readonly http: HttpClient) {}

  // Fetch all sources
  getSources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sources`);
  }

  // Fetch a single source by name
  getSource(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-source/${name}`);
  }

  // Add a new source
  addSource(source: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-source`, source);
  }

  // Update an existing source
  updateSource(source: any): Observable<any> {
    console.log('Payload to be sent to backend:', source); // Debugging
    return this.http.put(`${this.baseUrl}/update-source`, source);
  }
  
  
  // Delete a source by name
  deleteSource(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-source/${name}`);
  }
}
