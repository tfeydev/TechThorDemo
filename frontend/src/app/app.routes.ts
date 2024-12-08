import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataSourceManagerComponent } from './data-source-manager/data-source-manager.component';
import { AnalyticsHubComponent } from './analytics-hub/analytics-hub.component';
import { DataPreviewComponent } from './components/data-preview/data-preview.component';
import { MonitoringComponent } from './analytics-hub/components/monitoring/monitoring.component';
import { AnalysisComponent } from './analytics-hub/components/analysis/analysis.component';
import { ReportsComponent } from './analytics-hub/components/reports/reports.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'data-source-manager', component: DataSourceManagerComponent },
  { path: 'data-preview/:sourceName', component: DataPreviewComponent },
  { path: 'analytics-hub', component: AnalyticsHubComponent,
    children: [
      { path: '', redirectTo: 'analytics-hub/monitoring', pathMatch: 'full' },
      { path: 'analytics-hub/monitoring', component: MonitoringComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'reports', component: ReportsComponent },
    ] 
  },
  { path: '**', redirectTo: '' }, // Fallback route
];

