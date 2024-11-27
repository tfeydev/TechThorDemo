import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YamlService {
  private apiUrl = 'http://127.0.0.1:8000/data'; // Base URL for backend

  constructor(private http: HttpClient) {}

  // Fetch YAML data from backend
  getYaml(): Observable<any> {
    return this.http.get(`${this.apiUrl}/view-yaml`);
  }

  // Update YAML data
  updateYaml(updatedYaml: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-yaml`, updatedYaml);
  }
}
