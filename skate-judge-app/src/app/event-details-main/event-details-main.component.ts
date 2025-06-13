import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../shared/models/event.interface';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-details-main.component.html',
  styleUrls: ['./event-details-main.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log('EventDetails: Received ID:', eventId); // Debug log

    if (!eventId) {
      console.error('No event ID provided');
      this.router.navigate(['/']);
      return;
    }

    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      const events: Event[] = JSON.parse(savedEvents);
      this.event = events.find(e => e.id === eventId);
      console.log('Found event:', this.event); // Debug log
    }

    if (!this.event) {
      console.error('Event not found');
      this.router.navigate(['/']);
    }
  }
}
