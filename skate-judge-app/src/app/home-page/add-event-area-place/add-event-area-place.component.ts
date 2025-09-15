import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../shared/models/event.interface';
import { IndexedDbService } from '../../shared/service/db/indexeddb.service'; // Korrigierter Pfad

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

  constructor(
    private router: Router,
    private indexedDb: IndexedDbService // ✅ IndexedDB Service injiziert
  ) {}

  ngOnInit() {
    this.loadEventsFromIndexedDb();
  }

  /** Wird aufgerufen, wenn die Komponente wieder sichtbar wird */
  ionViewWillEnter() {
    this.loadEventsFromIndexedDb();
  }

  /** Aktualisiert die Daten wenn von anderen Seiten zurückgekehrt wird */
  async refreshData() {
    await this.loadEventsFromIndexedDb();
  }

  /** Lädt alle Events aus der IndexedDB */
  private async loadEventsFromIndexedDb() {
    try {
      this.events = await this.indexedDb.getAll<Event>('events');
      
      // Load athlete counts for each event from prueflinge table
      await this.updateAthleteCountsForEvents();
      
      this.showInitialContent = this.events.length === 0;
      console.log('📦 Events aus IndexedDB geladen:', this.events);
    } catch (error) {
      console.error('❌ Fehler beim Laden aus IndexedDB:', error);
    }
  }

  /** Aktualisiert die Athletenanzahl für jedes Event aus der prueflinge-Tabelle */
  private async updateAthleteCountsForEvents() {
    try {
      // Get all athletes from prueflinge table
      const allAthletes = await this.indexedDb.getAll<any>('prueflinge');
      
      // Count athletes for each event
      this.events.forEach(event => {
        const athleteCount = allAthletes.filter(athlete => athlete.eventId === event.id).length;
        // Store the real count in a property we can use in the template
        (event as any).actualAthleteCount = athleteCount;
      });
      
      console.log('🔢 Athletenanzahl für Events aktualisiert');
    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren der Athletenanzahl:', error);
    }
  }

  /** Gibt die tatsächliche Anzahl der Athleten für ein Event zurück */
  getAthleteCount(event: Event): number {
    return (event as any).actualAthleteCount || 0;
  }

  /** Öffnet das Event-Erstellungsformular */
  openCreateNewEvent() {
    console.log('➡️ Navigiere zum Erstellen eines neuen Events');
    this.router.navigate(['/create-event']);
  }

  /** Löscht ein Event aus der Liste und aus der IndexedDB */
  async deleteEvent(index: number) {
    const eventToDelete = this.events[index];
    console.log('🗑️ Lösche Event:', eventToDelete);

    try {
      // First, delete all athletes belonging to this event
      await this.deleteAthletesForEvent(eventToDelete.id!);
      
      // Then delete the event itself
      await this.indexedDb.deleteItem('events', eventToDelete.id!);
      this.events.splice(index, 1);
      this.showInitialContent = this.events.length === 0;
      
      // Update athlete counts for remaining events
      await this.updateAthleteCountsForEvents();
      
      console.log('✅ Event und zugehörige Athleten gelöscht');
    } catch (error) {
      console.error('❌ Fehler beim Löschen aus IndexedDB:', error);
    }
  }

  /** Löscht alle Athleten, die zu einem bestimmten Event gehören */
  private async deleteAthletesForEvent(eventId: string) {
    try {
      // Get all athletes from prueflinge table
      const allAthletes = await this.indexedDb.getAll<any>('prueflinge');
      
      // Find athletes belonging to this event
      const athletesToDelete = allAthletes.filter(athlete => athlete.eventId === eventId);
      
      console.log(`🏃‍♂️ Lösche ${athletesToDelete.length} Athleten für Event ${eventId}`);
      
      // Delete each athlete
      for (const athlete of athletesToDelete) {
        await this.indexedDb.deleteItem('prueflinge', athlete.id);
      }
      
      console.log('✅ Alle Athleten des Events gelöscht');
    } catch (error) {
      console.error('❌ Fehler beim Löschen der Athleten:', error);
    }
  }

  /** Navigiert zur Detailseite eines Events */
  navigateToEventDetails(eventId: string | undefined) {
    if (eventId) {
      console.log('➡️ Navigiere zu Event-Details für ID:', eventId);
      this.router.navigate(['/event', eventId]);
    }
  }

  /** Gibt Events in der Konsole aus */
  checkEvents() {
    console.log('📋 Aktuelle Events:', this.events);
    this.events.forEach(event => {
      console.log(`- ${event.name} (ID: ${event.id})`);
    });
  }

  /** Bereinigt verwaiste Athleten aus der prueflinge-Tabelle */
  async cleanupOrphanedAthletes() {
    try {
      console.log('🧹 Starting cleanup of orphaned athletes...');
      
      // Get all athletes and events
      const allAthletes = await this.indexedDb.getAll<any>('prueflinge');
      const allEvents = await this.indexedDb.getAll<any>('events');
      
      const existingEventIds = new Set(allEvents.map((event: any) => event.id));
      
      // Find orphaned athletes
      const orphanedAthletes = allAthletes.filter((athlete: any) => 
        athlete.eventId && !existingEventIds.has(athlete.eventId)
      );
      
      console.log(`🗑️ Found ${orphanedAthletes.length} orphaned athletes to delete`);
      
      // Delete orphaned athletes
      for (const athlete of orphanedAthletes) {
        await this.indexedDb.deleteItem('prueflinge', athlete.id);
        console.log(`🗑️ Deleted orphaned athlete: ${athlete.vorname} ${athlete.nachname} (Event: ${athlete.eventId})`);
      }
      
      console.log('✅ Cleanup completed - removed', orphanedAthletes.length, 'orphaned athletes');
      return orphanedAthletes.length;
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }
}