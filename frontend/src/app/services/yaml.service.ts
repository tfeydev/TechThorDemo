import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class YamlService {
  private apiUrl = 'http://localhost:8000/yaml'; // Adjust based on your backend configuration

  constructor(private http: HttpClient) {}

  // Parse YAML string into JavaScript object
  parseYaml(yamlString: string): any {
    return yaml.load(yamlString);
  }

  // Convert JavaScript object into YAML string
  toYamlString(config: any): string {
    return yaml.dump(config);
  }

  // Update YAML on the backend
  updateYaml(yamlData: any): Observable<any> {
    const yamlString = this.toYamlString(yamlData); // Convert object to YAML string
    return this.http.put(`${this.apiUrl}/update`, { yaml: yamlString });
  }
}
