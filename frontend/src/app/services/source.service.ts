import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SourceService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getSources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sources`);
  }

  loadData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load-data`);
  }

  addSource(source: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-source`, source);
  }

  editSource(source: any): Observable<any> {
    return this.http.put('/api/edit-source', source);
  }
  
  deleteSource(source: any): Observable<any> {
    return this.http.delete(`/api/delete-source/${source.id}`);
  }
  
}
