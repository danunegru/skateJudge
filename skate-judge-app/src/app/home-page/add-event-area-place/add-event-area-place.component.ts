import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.interface';

@Component({
  selector: 'app-add-event-area-place',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-event-area-place.component.html',
  styleUrls: ['./add-event-area-place.component.scss']
})
export class AddEventAreaPlaceComponent implements OnInit {
  events: Event[] = [];
  showInitialContent = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
      this.showInitialContent = this.events.length === 0;
    }
  }

  deleteEvent(index: number) {
    this.events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(this.events));
    this.showInitialContent = this.events.length === 0;
  }

  openCreateNewEvent() {
    this.router.navigate(['/create-event']);
  }
}
