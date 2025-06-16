import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.interface'; // Pfad ggf. anpassen

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:8080/api/veranstaltungen'; // Backend-Endpunkt

  constructor(private http: HttpClient) {}

  /**
   * Holt alle Veranstaltungen vom Server.
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  /**
   * Erstellt eine neue Veranstaltung.
   */
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
  }

  /**
   * Löscht eine Veranstaltung nach ID.
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
