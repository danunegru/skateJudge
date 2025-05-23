import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { InitialTestPageComponent } from './initial-test-page/initial-test-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },  // Homepage als Startseite
  { path: 'initial', component: InitialTestPageComponent }  // InitialTestPage unter /initial
];