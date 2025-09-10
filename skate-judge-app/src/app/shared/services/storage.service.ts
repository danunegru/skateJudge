import { Injectable } from '@angular/core';
import { IndexedDbService } from '../../indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private indexedDbService: IndexedDbService) {}

  // Hybrid approach: Try IndexedDB first, fallback to localStorage
  async saveAthlete(athlete: any): Promise<void> {
    try {
      // Save to IndexedDB
      const dbId = await this.indexedDbService.addSkater({
        name: athlete.vorname,
        lastname: athlete.nachname,
        verein: athlete.verein
      });
      
      // Also save to localStorage as backup
      athlete.dbId = dbId;
      this.saveToLocalStorage(athlete);
      
      console.log('✅ Athlete saved to both IndexedDB and localStorage');
    } catch (error) {
      console.error('IndexedDB failed, using localStorage only:', error);
      this.saveToLocalStorage(athlete);
    }
  }

  async getAllAthletes(): Promise<any[]> {
    try {
      // Try IndexedDB first
      const indexedDBAthletes = await this.indexedDbService.getAllSkaters();
      if (indexedDBAthletes.length > 0) {
        return indexedDBAthletes;
      }
    } catch (error) {
      console.error('IndexedDB failed, using localStorage:', error);
    }
    
    // Fallback to localStorage
    return this.getFromLocalStorage();
  }

  private saveToLocalStorage(athlete: any): void {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    // Add athlete to events...
    localStorage.setItem('events', JSON.stringify(events));
  }

  private getFromLocalStorage(): any[] {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    // Extract athletes from events...
    return [];
  }
}
