import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { Event } from '../shared/models/event.interface';

@Component({
  selector: 'app-create-new-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-new-event.component.html',
  styleUrls: ['./create-new-event.component.scss']
})
export class CreateNewEventComponent {
  eventForm: FormGroup;
  examOptions = ['Anfängerprüfung - Freiläufer (A1)', 'Anfängerprüfung - Figurenläufer (A2)', 'Anfängerprüfung - Kunstläufer (A3)',
    'Pflichtklasse 4 (P4)', 'Pflichtklasse 3 (P3)', 'Pflichtklasse 2 (P2)', 'Pflichtklasse 1 (P1)',
    'Kürklasse 4 (K4)', 'Kürklasse 3 (K3) - Nachwuchsklass', 'Kürklasse 2 (K2) - Juniorenklasse', 'Kürklasse 1 (K1) - Meisterklass'  ];
  selectedExamList: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.eventForm = this.fb.group({
      name: [''],
      veranstalter: [''],
      place: [''],  // Add this line
      startDate: [''],
      endDate: [''],
      selectedExams: [[]]
    });

    // Subscribe to changes in the select control
    this.eventForm.get('selectedExams')?.valueChanges.subscribe(values => {
      this.selectedExamList = values;
    });
  }

  closeCreateNewEvent() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...this.eventForm.value,
        prueflinge: []
      };
      
      console.log('Creating new event:', newEvent); // Debug log
      
      const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('events', JSON.stringify(existingEvents));
      
      this.router.navigate(['/']);
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    return true; // You can add additional date validation here if needed
  };
}
