import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailsComponent } from './event-details-main/event-details-main.component';
import { PrueflingFormComponent } from './pruefling-form/pruefling-form.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  {
    path: 'create-event',
    component: EventFormComponent
  },
  {
    path: 'event/:id',
    component: EventDetailsComponent
  },
  {
    path: 'pruefling-form',
    component: PrueflingFormComponent
  }
];