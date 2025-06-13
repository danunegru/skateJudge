import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateNewEventComponent } from './create-new-event/create-new-event.component';
import { EventDetailsComponent } from './event-details-main/event-details-main.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  {
    path: 'create-event',
    component: CreateNewEventComponent
  },
  {
    path: 'event/:id',
    component: EventDetailsComponent
  }
];