import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailsComponent } from './event-details-main/event-details-main.component';
import { PrueflingFormComponent } from './pruefling-form/pruefling-form.component';
import { UsersComponent } from './users/users.component';
import { A1Component } from './event-details-main/pruefungen/a1/a1.component';
import { A2Component } from './event-details-main/pruefungen/a2/a2.component';
import { A3Component } from './event-details-main/pruefungen/a3/a3.component';
import { P1Component } from './event-details-main/pruefungen/p1/p1.component';
import { P2Component } from './event-details-main/pruefungen/p2/p2.component';
import { P3Component } from './event-details-main/pruefungen/p3/p3.component';
import { P4Component } from './event-details-main/pruefungen/p4/p4.component';
import { K1Component } from './event-details-main/pruefungen/k1/k1.component';
import { K2Component } from './event-details-main/pruefungen/k2/k2.component';
import { K3Component } from './event-details-main/pruefungen/k3/k3.component';
import { K4Component } from './event-details-main/pruefungen/k4/k4.component';
import { AddEventAreaPlaceComponent } from './home-page/add-event-area-place/add-event-area-place.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AddEventAreaPlaceComponent
  }, { path: 'create-event', component: EventFormComponent },
  {
    path: 'add-event-area-place',
    component: AddEventAreaPlaceComponent
  }, {
    path: 'users', 
    component: UsersComponent},
  {
    path: 'event/:id',
    component: EventDetailsComponent
  },
  {
    path: 'pruefling-form',
    component: PrueflingFormComponent
  },
  { path: 'exam/:eventId/a1', component: A1Component },
  { path: 'exam/:eventId/a2', component: A2Component },
  { path: 'exam/:eventId/a3', component: A3Component },
  { path: 'exam/:eventId/p1', component: P1Component },
  { path: 'exam/:eventId/p2', component: P2Component },
  { path: 'exam/:eventId/p3', component: P3Component },
  { path: 'exam/:eventId/p4', component: P4Component },
  { path: 'exam/:eventId/k1', component: K1Component },
  { path: 'exam/:eventId/k2', component: K2Component },
  { path: 'exam/:eventId/k3', component: K3Component },
  { path: 'exam/:eventId/k4', component: K4Component }
];