import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { Event as SkateEvent, Exam, Pruefling } from '../../../shared/models/event.interface';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './a1.component.html',
  styleUrls: ['./a1.component.scss']
})
export class A1Component implements OnInit, AfterViewInit {
  // Basic properties
  eventId: string | null = null;
  event: SkateEvent | undefined;
  exam: Exam | undefined;
  isDetailsExpanded: boolean = false;
  prueflingeForExam: Pruefling[] = [];
  
  // Scoring properties
  scores: { [key: string]: number } = {};
  
  // Popup properties
  showScorePopup: boolean = false;
  currentScore: number = 1.5;
  currentPopupData: any = null;
  currentElementIndex: number = 1;
  currentAthleteIndex: number = 0;

  // Validation properties
  showMissingScoresWarning = false;
  missingScoresCount = 0;
  totalScoresNeeded = 0;

  // ViewChild references
  @ViewChild('elementsTable', { static: false }) elementsTable!: ElementRef;
  @ViewChild('athletesTable', { static: false }) athletesTable!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadEventData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.syncRowHeights(), 100);
    window.addEventListener('resize', () => this.syncRowHeights());
  }

  // Data loading
  private loadEventData(): void {
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

  // UI synchronization
  syncRowHeights(): void {
    if (!this.elementsTable || !this.athletesTable) return;

    const elementRows = this.elementsTable.nativeElement.querySelectorAll('tr');
    const athleteRows = this.athletesTable.nativeElement.querySelectorAll('tr');

    elementRows.forEach((row: HTMLElement, i: number) => {
      if (athleteRows[i]) {
        const maxHeight = Math.max(row.offsetHeight, athleteRows[i].offsetHeight);
        row.style.height = maxHeight + 'px';
        athleteRows[i].style.height = maxHeight + 'px';
      }
    });
  }

  toggleDetails() {
    this.isDetailsExpanded = !this.isDetailsExpanded;
    setTimeout(() => this.syncRowHeights(), 350);
  }

  // Popup management
  openScorePopup(elementIndex: number, athleteIndex: number, pruefling: any): void {
    this.currentElementIndex = elementIndex;
    this.currentAthleteIndex = athleteIndex;
    
    this.currentPopupData = {
      elementIndex,
      athleteIndex,
      athlete: `${pruefling.vorname} ${pruefling.nachname}`,
      verein: pruefling.verein,
      element: this.getElementName(elementIndex)
    };
    
    const existingScore = this.getScore(elementIndex, athleteIndex);
    this.currentScore = existingScore > 0 ? existingScore : 1.5;
    
    setTimeout(() => this.showScorePopup = true, 0);
  }

  closePopupDirectly(): void {
    this.showScorePopup = false;
    this.currentPopupData = null;
    this.currentScore = 1.5;
    setTimeout(() => this.syncRowHeights(), 50);
  }

  // Navigation
  canGoBack(): boolean {
    return !(this.currentElementIndex === 1 && this.currentAthleteIndex === 0);
  }

  canGoNext(): boolean {
    return !(this.currentElementIndex === 4 && this.currentAthleteIndex === this.prueflingeForExam.length - 1);
  }

  goToPreviousWithSave(): void {
    this.autoSaveScore();
    this.goToPrevious();
  }

  goToNextWithSave(): void {
    this.autoSaveScore();
    if (this.canGoNext()) {
      this.goToNext();
    } else {
      setTimeout(() => this.closePopupDirectly(), 1500);
    }
  }

  private goToPrevious(): void {
    if (this.currentAthleteIndex > 0) {
      this.currentAthleteIndex--;
    } else if (this.currentElementIndex > 1) {
      this.currentElementIndex--;
      this.currentAthleteIndex = this.prueflingeForExam.length - 1;
    }
    this.updatePopupData();
  }

  private goToNext(): void {
    if (this.currentAthleteIndex < this.prueflingeForExam.length - 1) {
      this.currentAthleteIndex++;
    } else if (this.currentElementIndex < 4) {
      this.currentElementIndex++;
      this.currentAthleteIndex = 0;
    }
    this.updatePopupData();
  }

  private updatePopupData(): void {
    const pruefling = this.prueflingeForExam[this.currentAthleteIndex];
    
    this.currentPopupData = {
      elementIndex: this.currentElementIndex,
      athleteIndex: this.currentAthleteIndex,
      athlete: `${pruefling.vorname} ${pruefling.nachname}`,
      verein: pruefling.verein,
      element: this.getElementName(this.currentElementIndex)
    };
    
    this.currentScore = this.getScore(this.currentElementIndex, this.currentAthleteIndex) || 1.5;
  }

  // Scoring
  onSliderChange(): void {
    if (this.currentScore < 1.0) this.currentScore = 1.0;
    if (this.currentScore > 2.5) this.currentScore = 2.5;
    
    this.currentScore = Math.round(this.currentScore * 10) / 10;
    this.autoSaveScore();
  }

  clearScore(): void {
    if (this.currentPopupData) {
      this.setScore(this.currentPopupData.elementIndex, this.currentPopupData.athleteIndex, 0);
      this.currentScore = 0;
    }
  }

  private autoSaveScore(): void {
    if (this.currentPopupData && this.currentScore > 0) {
      this.setScore(this.currentPopupData.elementIndex, this.currentPopupData.athleteIndex, this.currentScore);
    }
  }

  // Score management
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

  // Final confirmation
  confirmFinalScores(): void {
    const missingScores = this.checkForMissingScores();
    
    if (missingScores.length > 0) {
      this.showMissingScoresWarning = true;
      this.missingScoresCount = missingScores.length;
      this.totalScoresNeeded = this.prueflingeForExam.length * 4;
      
      setTimeout(() => this.showMissingScoresWarning = false, 5000);
      this.scrollToFirstMissingScore(missingScores[0]);
    } else {
      this.saveFinalScores();
    }
  }

  private checkForMissingScores(): { elementIndex: number, athleteIndex: number }[] {
    const missing: { elementIndex: number, athleteIndex: number }[] = [];
    
    for (let elementIndex = 1; elementIndex <= 4; elementIndex++) {
      for (let athleteIndex = 0; athleteIndex < this.prueflingeForExam.length; athleteIndex++) {
        const score = this.getScore(elementIndex, athleteIndex);
        if (!score || score === 0) {
          missing.push({ elementIndex, athleteIndex });
        }
      }
    }
    
    return missing;
  }

  private saveFinalScores(): void {
    this.showMissingScoresWarning = false;
    
    const finalScores = {
      eventId: this.event?.id,
      examId: this.exam?.id,
      scores: this.scores,
      completedAt: new Date().toISOString(),
      totalScores: this.prueflingeForExam.map((_, index) => this.getTotal(index))
    };
    
    localStorage.setItem(`scores_${this.exam?.id}`, JSON.stringify(finalScores));
    
    alert('Alle Bewertungen wurden erfolgreich gespeichert!');
    setTimeout(() => this.goBackToEventDetails(), 2000);
  }

  private scrollToFirstMissingScore(missing: { elementIndex: number, athleteIndex: number }): void {
    const button = document.querySelector(
      `[data-element="${missing.elementIndex}"][data-athlete="${missing.athleteIndex + 1}"]`
    ) as HTMLElement;
    
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      button.focus();
    }
  }

  // Utility methods
  getElementName(index: number): string {
    const elements = [
      'rechts und links vorwärts übersetzen',
      'rechts und links rückwärts übersetzen', 
      'Flieger mit Kante',
      'Bremsen durch Drehung auf rückwärts und auf die Stopper'
    ];
    return `${index}. ${elements[index - 1]}`;
  }

  getPrueflingeForExam(exam: Exam): Pruefling[] {
    if (!this.event?.prueflinge) return [];
    return this.event.prueflinge.filter(pruefling => 
      pruefling.exam.some(e => e.id === exam.id)
    );
  }

  goBackToEventDetails() {
    if (this.eventId) {
      this.router.navigate(['/event', this.eventId]);
    }
  }

  // Add this method to format the slider labels
  formatSliderLabel = (value: number): string => {
    const majorValues = [1.0, 1.5, 2.0, 2.5];
    if (majorValues.includes(value)) {
      return value.toFixed(1);
    }
    return ''; // Don't show labels for intermediate values
  };
}
