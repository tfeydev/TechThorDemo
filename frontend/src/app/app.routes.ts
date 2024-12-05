import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataSourceManagerComponent } from './data-source-manager/data-source-manager.component';
import { AnalyticsHubComponent } from './analytics-hub/analytics-hub.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'data-source-manager', component: DataSourceManagerComponent },
  { path: 'analytics-hub', component: AnalyticsHubComponent },
  { path: '**', redirectTo: '' }
];
