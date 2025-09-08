import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Event as SkateEvent, Exam, Pruefling } from '../../../shared/models/event.interface';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    FormsModule
  ],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.scss'
})
export class A1Component implements OnInit, AfterViewInit {
  eventId: string | null = null;
  event: SkateEvent | undefined;
  exam: Exam | undefined;
  isDetailsExpanded: boolean = false;
  prueflingeForExam: Pruefling[] = [];
  
  // Popup-related properties
  showScorePopup: boolean = false;
  currentScore: number = 0;
  currentPopupData: any = null;
  scores: { [key: string]: number } = {};
  quickScores = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

  // ViewChild to access DOM elements
  @ViewChild('elementsTable', { static: false }) elementsTable!: ElementRef;
  @ViewChild('athletesTable', { static: false }) athletesTable!: ElementRef;

  // Add navigation properties
  currentElementIndex: number = 1;
  currentAthleteIndex: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    if (this.eventId) {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        const events: SkateEvent[] = JSON.parse(savedEvents);
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

  ngAfterViewInit() {
    // Sync row heights after view is initialized
    setTimeout(() => {
      this.syncRowHeights();
    }, 100);

    // Add window resize listener
    window.addEventListener('resize', () => this.syncRowHeights());
  }

  // Row height synchronization function
  syncRowHeights(): void {
    if (!this.elementsTable || !this.athletesTable) return;

    const elementRows = this.elementsTable.nativeElement.querySelectorAll('tr');
    const athleteRows = this.athletesTable.nativeElement.querySelectorAll('tr');

    elementRows.forEach((row: HTMLElement, i: number) => {
      if (athleteRows[i]) {
        const h1 = row.offsetHeight;
        const h2 = athleteRows[i].offsetHeight;
        const maxH = Math.max(h1, h2);

        row.style.height = maxH + 'px';
        athleteRows[i].style.height = maxH + 'px';
      }
    });
  }

  // Call syncRowHeights when popup is closed (in case content changed)
  closePopup(event?: MouseEvent): void {
    if (event && event.target === event.currentTarget) {
      this.showScorePopup = false;
      this.currentPopupData = null;
      this.currentScore = 0;
    } else if (!event) {
      this.showScorePopup = false;
      this.currentPopupData = null;
      this.currentScore = 0;
    }

    // Re-sync heights after popup closes
    setTimeout(() => {
      this.syncRowHeights();
    }, 50);
  }

  // Update openScorePopup to set current indices
  openScorePopup(elementIndex: number, athleteIndex: number, pruefling: any): void {
    this.currentElementIndex = elementIndex;
    this.currentAthleteIndex = athleteIndex;
    
    this.currentPopupData = {
      elementIndex: elementIndex,
      athleteIndex: athleteIndex,
      athlete: `${pruefling.vorname} ${pruefling.nachname}`,
      verein: pruefling.verein,
      element: this.getElementName(elementIndex)
    };
    
    this.currentScore = this.getScore(elementIndex, athleteIndex) || 0;
    this.showScorePopup = true;
  }

  // Navigation methods
  goToPrevious(): void {
    if (this.currentAthleteIndex > 0) {
      // Previous athlete in same element
      this.currentAthleteIndex--;
    } else if (this.currentElementIndex > 1) {
      // Last athlete of previous element
      this.currentElementIndex--;
      this.currentAthleteIndex = this.prueflingeForExam.length - 1;
    }
    this.updatePopupData();
  }

  goToNext(): void {
    if (this.currentAthleteIndex < this.prueflingeForExam.length - 1) {
      // Next athlete in same element
      this.currentAthleteIndex++;
    } else if (this.currentElementIndex < 4) {
      // First athlete of next element
      this.currentElementIndex++;
      this.currentAthleteIndex = 0;
    }
    this.updatePopupData();
  }

  // Check if navigation buttons should be enabled
  canGoBack(): boolean {
    return !(this.currentElementIndex === 1 && this.currentAthleteIndex === 0);
  }

  canGoNext(): boolean {
    return !(this.currentElementIndex === 4 && this.currentAthleteIndex === this.prueflingeForExam.length - 1);
  }

  // Update popup data when navigating
  private updatePopupData(): void {
    const pruefling = this.prueflingeForExam[this.currentAthleteIndex];
    
    this.currentPopupData = {
      elementIndex: this.currentElementIndex,
      athleteIndex: this.currentAthleteIndex,
      athlete: `${pruefling.vorname} ${pruefling.nachname}`,
      verein: pruefling.verein,
      element: this.getElementName(this.currentElementIndex)
    };
    
    this.currentScore = this.getScore(this.currentElementIndex, this.currentAthleteIndex) || 0;
  }

  // Update saveScore to auto-navigate to next
  saveScore(): void {
    if (this.isValidScore() && this.currentPopupData) {
      this.setScore(
        this.currentPopupData.elementIndex, 
        this.currentPopupData.athleteIndex, 
        this.currentScore
      );
      
      // Auto-navigate to next athlete/element
      if (this.canGoNext()) {
        this.goToNext();
      } else {
        // Close popup if at the end
        this.closePopup();
      }
    }
  }

  // Update clearScore method
  clearScore(): void {
    if (this.currentPopupData) {
      this.setScore(
        this.currentPopupData.elementIndex, 
        this.currentPopupData.athleteIndex, 
        0
      );
      this.currentScore = 0;
    }
  }

  // Update isValidScore for new range
  isValidScore(): boolean {
    return this.currentScore >= 1.0 && this.currentScore <= 2.5;
  }

  // Toggle details and re-sync heights
  toggleDetails() {
    this.isDetailsExpanded = !this.isDetailsExpanded;
    
    // Re-sync heights after toggle animation
    setTimeout(() => {
      this.syncRowHeights();
    }, 350); // Wait for CSS transition to complete
  }

  // Existing methods... (keep all your existing methods)
  getElementName(index: number): string {
    const elements = [
      'rechts und links vorwärts übersetzen',
      'rechts und links rückwärts übersetzen', 
      'Flieger mit Kante',
      'Bremsen durch Drehung auf rückwärts und auf die Stopper'
    ];
    return `${index}. ${elements[index - 1]}`;
  }

  getScore(elementIndex: number, athleteIndex: number): number {
    return this.scores[`${elementIndex}-${athleteIndex}`] || 0;
  }

  setScore(elementIndex: number, athleteIndex: number, score: number): void {
    this.scores[`${elementIndex}-${athleteIndex}`] = score;
  }

  getTotal(athleteIndex: number): string {
    let total = 0;
    for (let i = 1; i <= 4; i++) {
      total += this.getScore(i, athleteIndex);
    }
    return total.toFixed(1);
  }

  getPrueflingeForExam(exam: Exam): Pruefling[] {
    if (!this.event || !this.event.prueflinge) return [];
    
    return this.event.prueflinge.filter(pruefling => 
      pruefling.exam.some(e => e.id === exam.id)
    );
  }

  goBackToEventDetails() {
    if (this.eventId) {
      this.router.navigate(['/event', this.eventId]);
    }
  }
}
