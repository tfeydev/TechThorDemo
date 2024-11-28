import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  editSource(source: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit-source`, source);
  }

  deleteSource(source: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-source/${source.name}`);
  }

  loadData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load-data`);
  }

  loadDataByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/data/load/${name}`);
  }

  updateYaml(source: any) {
    return this.http.put(`${this.baseUrl}/update-source`, source);
  }
  
  
}
