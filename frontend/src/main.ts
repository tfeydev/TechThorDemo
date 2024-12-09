import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideServerRendering } from '@angular/platform-server';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideServerRendering(),
    provideRouter(routes),
    provideAnimations(), // Enable animations here
  ],
}).catch((err) => console.error(err));
