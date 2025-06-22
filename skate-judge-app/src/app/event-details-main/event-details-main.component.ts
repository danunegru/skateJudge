import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Event, Exam, Pruefling } from '../shared/models/event.interface';
import { PrueflingFormComponent } from '../pruefling-form/pruefling-form.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule
  ],
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


   /**
   * Initializes the component by loading the event details
   * based on the ID from the URL parameters.
   */
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

   /**
   * Navigates back to the main/home view.
   */

  goBack() {
    this.router.navigate(['/']);
  }

    /**
   * Opens a dialog to add a new participant (Pruefling) to the event.
   * The new entry is saved into the event and updated in localStorage.
   */
  addPruefling() {
    if (this.eventDetails) {
      const dialogRef = this.dialog.open(PrueflingFormComponent, {
        data: {
          eventId: this.eventDetails.id,
          exams: this.eventDetails.selectedExams
        }
      });

      dialogRef.afterClosed().subscribe((result: Pruefling | undefined) => {
        if (result && this.eventDetails) {
          if (!Array.isArray(this.eventDetails.prueflinge)) {
            this.eventDetails.prueflinge = [];
          }
          
          const newPruefling = {
            ...result,
            id: crypto.randomUUID()  // Add ID after spreading result
          };
          
          this.eventDetails.prueflinge.push(newPruefling);
          
          // Update localStorage
          const savedEvents = localStorage.getItem('events');
          if (savedEvents) {
            const events: Event[] = JSON.parse(savedEvents);
            const eventIndex = events.findIndex(e => e.id === this.eventDetails?.id);
            if (eventIndex !== -1 && this.eventDetails) {
              events[eventIndex] = { ...this.eventDetails };
              localStorage.setItem('events', JSON.stringify(events));
            }
          }
        }
      });
    }
  }

  
  /**
   * Returns all participants (Prueflinge) registered for a specific exam.
   * 
   * @param exam - The exam to filter participants for.
   * @returns An array of Prueflinge attending the given exam.
   */
  getPrueflingeForExam(exam: Exam): any[] {
    if (!this.eventDetails?.prueflinge) return [];
    
    return this.eventDetails.prueflinge.filter(pruefling => 
      pruefling.exam.some(e => e.id === exam.id)
    );
  }
}
