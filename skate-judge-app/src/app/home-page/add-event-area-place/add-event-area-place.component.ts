import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../shared/models/event.interface';

@Component({
  selector: 'app-add-event-area-place',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './add-event-area-place.component.html',
  styleUrls: ['./add-event-area-place.component.scss']
})
export class AddEventAreaPlaceComponent implements OnInit {
  events: Event[] = [];
  showInitialContent = true;

  constructor(private router: Router) {}

  ngOnInit() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
      this.showInitialContent = this.events.length === 0;
      console.log('Loaded events:', this.events);
    }
  }

  openCreateNewEvent() {
    console.log('Opening create new event');
    this.router.navigate(['/create-event']);
  }

  deleteEvent(index: number) {
    console.log('Deleting event at index:', index);
    this.events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(this.events));
    this.showInitialContent = this.events.length === 0;
  }

  navigateToEventDetails(eventId: string | undefined) {
    console.log('Navigating to event:', eventId);
    if (eventId) {
      this.router.navigate(['/event', eventId]);
    }
  }

  // Add this temporary debug method to AddEventAreaPlaceComponent
checkEvents() {
  console.log('Current events:', this.events);
  this.events.forEach(event => {
    console.log(`Event ${event.name} has ID:`, event.id);
  });
}
}
