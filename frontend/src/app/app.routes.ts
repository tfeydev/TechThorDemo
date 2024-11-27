import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SourceFormComponent } from './components/source-form/source-form.component';
import { DataViewerComponent } from './components/data-viewer/data-viewer.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'source-form', component: SourceFormComponent },
  { path: 'data/:name', component: DataViewerComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
