import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { InitialTestPageComponent } from './initial-test-page/initial-test-page.component';
import { MandatoryClassesPageComponent } from './mandatory-classes-page/mandatory-classes-page.component';
import { FirstTestComponent } from './first-test/first-test.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },  // Explizite /home Route
  { path: 'initial', component: InitialTestPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' } , // Root leitet zu /home 
  { path: 'mandatory', component: MandatoryClassesPageComponent},
  { path: 'first', component: FirstTestComponent }
];