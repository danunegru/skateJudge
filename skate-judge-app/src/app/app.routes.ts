import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },  // Explizite /home Route
  { path: '', redirectTo: 'home', pathMatch: 'full' } , // Root leitet zu /home  "AnfangsRoute"
];