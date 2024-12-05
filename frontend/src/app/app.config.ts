// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DataSourceManagerComponent } from './data-source-manager/data-source-manager.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'data-source-manager', component: DataSourceManagerComponent },
    ]),
    provideHttpClient(),
  ],
};
