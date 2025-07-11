import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api'; // Backend base URL

  constructor(private http: HttpClient) {}

  // Fetch all sources
  getSources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sources`);
  }

  getSourceStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/status`);
  }

  addSource(source: any): Observable<any> {
    console.log('DEBUG: Sending payload to POST /sources:', source);
    return this.http.post(`${this.baseUrl}/sources`, source);
  }
  
  updateSource(name: string, source: any): Observable<any> {
    console.log(`DEBUG: Sending payload to PUT /sources/${name}:`, source);
    return this.http.put(`${this.baseUrl}/sources/${name}`, source);
  }
  
  // Delete a source
  deleteSource(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/sources/${name}`);
  }

  getDataPreview(sourceName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/preview/${sourceName}`);
  }


}
