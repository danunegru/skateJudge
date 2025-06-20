import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Event, Exam } from '../../../shared/models/event.interface';

@Component({
  selector: 'app-a2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a2.component.html',
  styleUrl: './a2.component.scss'
})

export class A2Component implements OnInit {
  eventId: string | null = null;
  event: Event | undefined;
  exam: Exam | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    if (this.eventId) {
      // Get event from localStorage
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        const events: Event[] = JSON.parse(savedEvents);
        this.event = events.find(e => e.id === this.eventId);
        
        if (this.event) {
          // Find the A2 exam in the event's selected exams
          this.exam = this.event.selectedExams.find(e => e.id.toLowerCase() === 'a2');
        }
      }
    }
  }

}
