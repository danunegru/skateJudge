import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateNewEventComponent } from './create-new-event/create-new-event.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'create-event', component: CreateNewEventComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];