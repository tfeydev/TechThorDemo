import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatCardModule
  ]
}) 
export class HomeComponent {

  constructor(private router: Router) {}

  onNavigate(route: string): void {
    this.router.navigate([route]); // Navigate to the specified route
  }
}