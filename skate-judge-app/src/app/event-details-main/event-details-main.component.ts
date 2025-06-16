import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Event, Exam } from '../shared/models/event.interface';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-details-main.component.html',
  styleUrls: ['./event-details-main.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventDetails: Event | undefined;
  selectedExams: Exam[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        const events: Event[] = JSON.parse(savedEvents);
        this.eventDetails = events.find(e => e.id === eventId);
        if (this.eventDetails) {
          this.selectedExams = this.eventDetails.selectedExams;
        }
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
