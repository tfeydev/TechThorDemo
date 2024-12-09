// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DataSourceManagerComponent } from './data-source-manager/data-source-manager.component';
import { AnalyticsHubComponent } from './analytics-hub/analytics-hub.component';
import { MonitoringComponent } from './analytics-hub/components/monitoring/monitoring.component';
import { AnalysisComponent } from './analytics-hub/components/analysis/analysis.component';
import { ReportsComponent } from './analytics-hub/components/reports/reports.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'data-source-manager', component: DataSourceManagerComponent },
      { path: 'analytics-hub', component: AnalyticsHubComponent,
        children: [
          { path: 'monitoring', component: MonitoringComponent },
          { path: 'analysis', component: AnalysisComponent },
          { path: 'reports', component: ReportsComponent },
        ]
      },
    ]),
    provideHttpClient(),
  ],
};
