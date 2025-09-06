import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Event, Exam, Pruefling } from '../../../shared/models/event.interface';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.scss'
})
export class A1Component implements OnInit {
  eventId: string | null = null;
  event: Event | undefined;
  exam: Exam | undefined;
  isDetailsExpanded: boolean = false;
  prueflingeForExam: Pruefling[] = [];
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    if (this.eventId) {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        const events: Event[] = JSON.parse(savedEvents);
        this.event = events.find(e => e.id === this.eventId);
        
        if (this.event) {
          this.exam = this.event.selectedExams.find(e => e.id.toLowerCase() === 'a1');
          
          if (this.exam) {
            this.prueflingeForExam = this.getPrueflingeForExam(this.exam);
          }
        }
      }
    }
  }

  getPrueflingeForExam(exam: Exam): Pruefling[] {
    if (!this.event || !this.event.prueflinge) return [];
    
    return this.event.prueflinge.filter(pruefling => 
      pruefling.exam.some(e => e.id === exam.id)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.prueflingeForExam.length / this.pageSize);
  }

  get currentPageAthletes(): Pruefling[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.prueflingeForExam.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  toggleDetails() {
    this.isDetailsExpanded = !this.isDetailsExpanded;
  }

  goBackToEventDetails() {
    if (this.eventId) {
      this.router.navigate(['/event', this.eventId]);
    }
  }
}
