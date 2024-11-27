import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root' })
export class SourceService {
  private readonly baseUrl = 'http://127.0.0.1:8000/data';

  constructor(private readonly http: HttpClient) {}

  getSources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sources`);
  }

  addSource(source: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-source`, source);
  }
  
  loadData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load-data`);
  }

  editSource(source: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit-source`, source);
  }
  
  deleteSource(source: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-source/${source.name}`);
  }
  
}
