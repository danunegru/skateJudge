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
import { IndexedDbService } from '../shared/service/db/indexeddb.service'; // ✅ Add this import

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
    private snackBar: MatSnackBar,
    private indexedDb: IndexedDbService // ✅ Add this injection
  ) {}

  /**
   * Initializes the component by loading the event details from IndexedDB
   */
  async ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      try {
        // ✅ Load from IndexedDB instead of localStorage
        const events: Event[] = await this.indexedDb.getAll<Event>('events');
        this.eventDetails = events.find(e => e.id === eventId);
        
        if (this.eventDetails) {
          this.selectedExams = this.eventDetails.selectedExams;
          // Load athletes from separate prueflinge table
          await this.loadAthletesFromPrueflingeTable();
          console.log('📋 Event loaded from IndexedDB:', this.eventDetails);
        } else {
          console.warn('⚠️ Event not found in IndexedDB');
        }
      } catch (error) {
        console.error('❌ Error loading events from IndexedDB:', error);
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

      dialogRef.afterClosed().subscribe(async (result: Pruefling | undefined) => {
        console.log('🎯 Dialog closed with result:', result);
        
        if (result && this.eventDetails) {
          if (!Array.isArray(this.eventDetails.prueflinge)) {
            this.eventDetails.prueflinge = [];
          }
          
          const newPruefling = {
            ...result,
            id: crypto.randomUUID(),  // Add ID after spreading result
            eventId: this.eventDetails.id,  // Link to event
            createdAt: new Date().toISOString(),
            hidden: false
          };
          
          console.log('👤 Adding new athlete:', newPruefling);
          
          try {
            // Save to prueflinge table (separate athlete management)
            console.log('💽 Saving athlete to prueflinge table:', newPruefling);
            await this.indexedDb.saveItem<Pruefling>('prueflinge', newPruefling);
            console.log('💾 Athlete saved to prueflinge table');
            
            // Also add to event for event-specific data
            this.eventDetails.prueflinge.push(newPruefling);
            console.log('📋 Total athletes now:', this.eventDetails.prueflinge.length);
            
            // Update event in IndexedDB
            this.updateEventInStorage();
            
            console.log('✅ Athlete saved to both locations');
          } catch (error) {
            console.error('❌ Error saving athlete:', error);
          }
        } else {
          console.log('❌ No result or no event details');
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
   * Updates the event in IndexedDB after modifications.
   */
  private async updateEventInStorage() {
    if (!this.eventDetails) return;
    
    try {
      // ✅ Save to IndexedDB instead of localStorage
      await this.indexedDb.saveItem<Event>('events', this.eventDetails);
      console.log('💾 Event updated in IndexedDB');
    } catch (error) {
      console.error('❌ Error updating event in IndexedDB:', error);
    }
  }

  /**
   * Loads athletes from the separate prueflinge table
   */
  private async loadAthletesFromPrueflingeTable() {
    if (!this.eventDetails) return;
    
    try {
      console.log('🔍 Attempting to load athletes from prueflinge table...');
      const allAthletes: Pruefling[] = await this.indexedDb.getAll<Pruefling>('prueflinge');
      console.log('🗃️ All athletes in prueflinge table:', allAthletes);
      console.log('🎯 Looking for eventId:', this.eventDetails.id);
      
      const eventAthletes = allAthletes.filter(athlete => {
        console.log(`👤 Athlete ${athlete.vorname} ${athlete.nachname} has eventId: ${athlete.eventId}`);
        return athlete.eventId === this.eventDetails?.id;
      });
      
      // Update event with athletes from prueflinge table
      this.eventDetails.prueflinge = eventAthletes;
      console.log('📊 Loaded athletes from prueflinge table:', eventAthletes.length);
      console.log('📋 Final event prueflinge:', this.eventDetails.prueflinge);
    } catch (error) {
      console.error('❌ Error loading athletes from prueflinge table:', error);
    }
  }

  /**
   * Cleans up orphaned athletes whose events no longer exist
   */
  async cleanupOrphanedAthletes() {
    try {
      console.log('🧹 Starting cleanup of orphaned athletes...');
      
      // Get all athletes and events
      const allAthletes: Pruefling[] = await this.indexedDb.getAll<Pruefling>('prueflinge');
      const allEvents: Event[] = await this.indexedDb.getAll<Event>('events');
      
      const existingEventIds = new Set(allEvents.map(event => event.id));
      
      // Find orphaned athletes
      const orphanedAthletes = allAthletes.filter(athlete => 
        athlete.eventId && !existingEventIds.has(athlete.eventId)
      );
      
      console.log(`🗑️ Found ${orphanedAthletes.length} orphaned athletes to delete`);
      
      // Delete orphaned athletes
      for (const athlete of orphanedAthletes) {
        await this.indexedDb.deleteItem('prueflinge', athlete.id);
        console.log(`🗑️ Deleted orphaned athlete: ${athlete.vorname} ${athlete.nachname} (Event: ${athlete.eventId})`);
      }
      
      console.log('✅ Cleanup completed');
      return orphanedAthletes.length;
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }
}
