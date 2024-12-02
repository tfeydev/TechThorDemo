
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor() {}

  // Centralized error handling
  handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error.message);
    return throwError(() => new Error('A network error occurred.'));
  }
}
