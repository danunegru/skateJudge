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
        // Loading events
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
          
          // ... after adding participant
          // Update localStorage, Saving updated events
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

  /**
   * Checks if a participant with the same name already exists in the event
   */
  private isDuplicateParticipant(newPruefling: any): boolean {
    if (!this.eventDetails?.prueflinge) {
      return false;
    }

    return this.eventDetails.prueflinge.some(existing => 
      existing.vorname?.toLowerCase() === newPruefling.vorname?.toLowerCase() &&
      existing.nachname?.toLowerCase() === newPruefling.nachname?.toLowerCase() &&
      existing.verein?.toLowerCase() === newPruefling.verein?.toLowerCase()
    );
  }

  /**
   * Adds a participant (Pruefling) to a specific exam within the event.
   * Opens the PrueflingFormComponent dialog pre-filled for the selected exam.
   * Updates the event and localStorage upon adding the participant.
   * 
   * @param exam - The exam to which the participant will be added.
   */
  addPrueflingToExam(exam: any) {
    if (!this.eventDetails) return;

    const dialogRef = this.dialog.open(PrueflingFormComponent, {
      width: '500px',
      data: { 
        eventId: this.eventDetails.id, 
        exams: [exam],
        preSelectedExam: exam
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.eventDetails) {
        // Check for duplicates
        if (this.isDuplicateParticipant(result)) {
          // Instead of adding new, just add the exam to existing participant
          const existingIndex = this.eventDetails.prueflinge.findIndex(p => 
            p.vorname?.toLowerCase() === result.vorname?.toLowerCase() &&
            p.nachname?.toLowerCase() === result.nachname?.toLowerCase() &&
            p.verein?.toLowerCase() === result.verein?.toLowerCase()
          );
          
          if (existingIndex !== -1) {
            // Add exam to existing participant if not already there
            const existingExams = this.eventDetails.prueflinge[existingIndex].exam || [];
            const examExists = existingExams.some((e: any) => e.id === exam.id);
            
            if (!examExists) {
              this.eventDetails.prueflinge[existingIndex].exam = [...existingExams, exam];
            }
          }
        } else {
          // Add new participant
          if (!this.eventDetails.prueflinge) {
            this.eventDetails.prueflinge = [];
          }
          
          const newPruefling = {
            ...result,
            id: crypto.randomUUID(),
            exam: [exam]
          };
          
          this.eventDetails.prueflinge.push(newPruefling);
        }
        
        this.updateEventInStorage();
      }
    });
  }

  /**
   * Updates the event in localStorage after modifications.
   * Ensures the event details are saved correctly.
   */
  private updateEventInStorage() {
    if (!this.eventDetails) return;
    
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventIndex = events.findIndex((e: any) => e.id === this.eventDetails!.id);
    
    if (eventIndex !== -1) {
      events[eventIndex] = { ...this.eventDetails }; // Create a copy to avoid reference issues
      localStorage.setItem('events', JSON.stringify(events));
    }
  }

  /**
 * Gets the count of unique participants based on first and last name combination
 * Prevents counting the same person multiple times if they're in different exams
 */
getUniquePrueflingeCount(): number {
  if (!this.eventDetails?.prueflinge) {
    return 0;
  }

  const uniqueNames = new Set<string>();
  
  this.eventDetails.prueflinge.forEach(pruefling => {
    // Create unique identifier using first and last name (case-insensitive)
    const nameKey = `${pruefling.vorname?.toLowerCase()}-${pruefling.nachname?.toLowerCase()}`;
    uniqueNames.add(nameKey);
  });

  return uniqueNames.size;
}
}
