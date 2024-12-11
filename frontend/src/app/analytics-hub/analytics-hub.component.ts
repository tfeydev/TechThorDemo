import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ReportsComponent } from './components/reports/reports.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
    selector: 'app-analytics-hub',
    templateUrl: './analytics-hub.component.html',
    styleUrls: ['./analytics-hub.component.scss'],
    imports: [
        MatTabsModule,
        MonitoringComponent,
        AnalysisComponent,
        ReportsComponent,
        RouterModule,
        CommonModule,
        RouterLink,
        RouterOutlet,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule
    ]
})
export class AnalyticsHubComponent {

}
