import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Event, Exam } from '../shared/models/event.interface';
import { PrueflingFormComponent } from '../pruefling-form/pruefling-form.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule,RouterModule, MatIconModule, MatExpansionModule, MatListModule],
  templateUrl: './event-details-main.component.html',
  styleUrls: ['./event-details-main.component.scss']
})



export class EventDetailsComponent implements OnInit {
  eventDetails: Event | undefined;
  selectedExams: Exam[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
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

  addPruefling() {
    if (this.eventDetails) {  // Check if eventDetails exists
      const dialogRef = this.dialog.open(PrueflingFormComponent, {
        data: {
          eventId: this.eventDetails.id,
          exams: this.eventDetails.selectedExams
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.eventDetails) {  // Double check eventDetails still exists
          // Initialize prueflinge array if it doesn't exist
          if (!Array.isArray(this.eventDetails.prueflinge)) {
            this.eventDetails.prueflinge = [];
          }
          
          const newPruefling = {
            id: crypto.randomUUID(),
            ...result
          };
          
          this.eventDetails.prueflinge.push(newPruefling);
          
          // Update localStorage
          const savedEvents = localStorage.getItem('events');
          if (savedEvents) {
            const events: Event[] = JSON.parse(savedEvents);
            const eventIndex = events.findIndex(e => e.id === this.eventDetails?.id);
            if (eventIndex !== -1 && this.eventDetails) {
              events[eventIndex] = { ...this.eventDetails };  // Create a copy
              localStorage.setItem('events', JSON.stringify(events));
            }
          }
        }
      });
    }
  }

  getPrueflingeForExam(exam: Exam): any[] {
    if (!this.eventDetails?.prueflinge) return [];
    
    return this.eventDetails.prueflinge.filter(pruefling => 
      pruefling.exam.some(e => e.id === exam.id)
    );
  }
}
