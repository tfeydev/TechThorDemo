import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataSourceManagerComponent } from './data-source-manager/data-source-manager.component';
import { AnalyticsHubComponent } from './analytics-hub/analytics-hub.component';
import { DataPreviewComponent } from './components/data-preview/data-preview.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'data-source-manager', component: DataSourceManagerComponent },
  { path: 'data-preview/:sourceName', component: DataPreviewComponent },
  { path: 'analytics-hub', component: AnalyticsHubComponent },
  { path: '**', redirectTo: '' }
];
