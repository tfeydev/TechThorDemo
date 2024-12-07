import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ReportsComponent } from './components/reports/reports.component';


@Component({
  selector: 'app-analytics-hub',
  standalone: true,
  templateUrl: './analytics-hub.component.html',
  styleUrls: ['./analytics-hub.component.scss'],
  imports: [
    MonitoringComponent,
    AnalysisComponent,
    ReportsComponent,
    RouterModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatTabsModule
  ]
})
export class AnalyticsHubComponent {

}
