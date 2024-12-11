import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
    selector: 'app-analytics-hub',
    templateUrl: './analytics-hub.component.html',
    styleUrls: ['./analytics-hub.component.scss'],
    imports: [
        MatTabsModule,
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
