import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './event-details-main.component.html',
  styleUrls: ['./event-details-main.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventDetails: Event | undefined;
  selectedExams: Exam[] = [];

  // Athlete management properties
  editingAthleteId: string | null = null;
  editForm = { vorname: '', nachname: '', verein: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
          this.updateEventInStorage();
        }
      });
    }
  }

  /**
   * Returns all participants (Prueflinge) registered for a specific exam.
   * Shows ALL athletes including hidden ones (they appear grey but stay visible).
   * 
   * @param exam - The exam to filter participants for.
   * @returns An array of Prueflinge attending the given exam.
   */
  getPrueflingeForExam(exam: Exam): Pruefling[] {
    if (!this.eventDetails?.prueflinge) return [];
    
    return this.eventDetails.prueflinge.filter(pruefling => 
      pruefling.exam.some((e: any) => e.id === exam.id)
      // Show all athletes - hidden ones will appear grey via CSS
    );
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

  // Athlete management methods
  startEditing(pruefling: any): void {
    this.editingAthleteId = pruefling.id;
    this.editForm = {
      vorname: pruefling.vorname,
      nachname: pruefling.nachname,
      verein: pruefling.verein
    };
  }

  saveEdit(pruefling: any): void {
    if (!this.isEditFormValid()) return;

    // Update the athlete
    pruefling.vorname = this.editForm.vorname.trim();
    pruefling.nachname = this.editForm.nachname.trim();
    pruefling.verein = this.editForm.verein.trim();

    this.updateEventInStorage();
    this.cancelEdit();
    
    this.snackBar.open('Athlet erfolgreich aktualisiert', 'OK', { duration: 2000 });
  }

  cancelEdit(): void {
    this.editingAthleteId = null;
    this.editForm = { vorname: '', nachname: '', verein: '' };
  }

  isEditFormValid(): boolean {
    return this.editForm.vorname.trim().length > 0 && 
           this.editForm.nachname.trim().length > 0 && 
           this.editForm.verein.trim().length > 0;
  }

  toggleAthleteVisibility(pruefling: any): void {
    // Initialize hidden property if it doesn't exist
    if (pruefling.hidden === undefined) {
      pruefling.hidden = false;
    }
    
    pruefling.hidden = !pruefling.hidden;
    this.updateEventInStorage();
    
    const message = pruefling.hidden ? 'Athlet ausgeblendet (grau dargestellt)' : 'Athlet wieder aktiv';
    this.snackBar.open(message, 'Rückgängig', { duration: 3000 })
      .onAction().subscribe(() => {
        pruefling.hidden = !pruefling.hidden;
        this.updateEventInStorage();
      });
  }

  deleteAthlete(pruefling: any, exam: any): void {
    if (!this.eventDetails?.prueflinge) return;

    // If athlete is only in this exam, remove completely
    if (pruefling.exam.length === 1) {
      const index = this.eventDetails.prueflinge.findIndex(p => p.id === pruefling.id);
      if (index !== -1) {
        this.eventDetails.prueflinge.splice(index, 1);
      }
    } else {
      // Remove only this exam from the athlete
      pruefling.exam = pruefling.exam.filter((e: any) => e.id !== exam.id);
    }

    this.updateEventInStorage();
    
    this.snackBar.open('Athlet entfernt', 'Rückgängig', { duration: 5000 })
      .onAction().subscribe(() => {
        // Restore athlete logic would go here
        // For simplicity, we'll just show a message
        this.snackBar.open('Rückgängig-Funktion in Entwicklung', 'OK', { duration: 2000 });
      });
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
}
