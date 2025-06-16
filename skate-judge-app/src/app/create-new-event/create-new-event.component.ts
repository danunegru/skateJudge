import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { Router } from '@angular/router';
import { Event, Exam } from '../shared/models/event.interface';
import { TextFieldModule } from '@angular/cdk/text-field';

// Define custom date formats
export const GERMAN_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    TextFieldModule
  ],
  templateUrl: './create-new-event.component.html',
  styleUrls: ['./create-new-event.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class CreateNewEventComponent implements OnInit {
  eventForm: FormGroup;
  examOptions: Exam[] = [
    {
      id: 'A1',
      name: 'Anfängerprüfung - Freiläufer',
      shortCode: 'A1',
      category: 'Anfänger',
      level: 1
    },
    {
      id: 'A2',
      name: 'Anfängerprüfung - Figurenläufer',
      shortCode: 'A2',
      category: 'Anfänger',
      level: 2
    },
    {
      id: 'A3',
      name: 'Anfängerprüfung - Kunstläufer',
      shortCode: 'A3',
      category: 'Anfänger',
      level: 3
    },
    {
      id: 'P4',
      name: 'Pflichtklasse 4',
      shortCode: 'P4',
      category: 'Pflicht',
      level: 4
    },
    {
      id: 'P3',
      name: 'Pflichtklasse 3',
      shortCode: 'P3',
      category: 'Pflicht',
      level: 3
    },
    {
      id: 'P2',
      name: 'Pflichtklasse 2',
      shortCode: 'P2',
      category: 'Pflicht',
      level: 2
    },
    {
      id: 'P1',
      name: 'Pflichtklasse 1',
      shortCode: 'P1',
      category: 'Pflicht',
      level: 1
    },
    {
      id: 'K4',
      name: 'Kürklasse 4',
      shortCode: 'K4',
      category: 'Kür',
      level: 4
    },
    {
      id: 'K3',
      name: 'Kürklasse 3 - Nachwuchsklasse',
      shortCode: 'K3',
      category: 'Kür',
      level: 3
    },
    {
      id: 'K2',
      name: 'Kürklasse 2 - Juniorenklasse',
      shortCode: 'K2',
      category: 'Kür',
      level: 2
    },
    {
      id: 'K1',
      name: 'Kürklasse 1 - Meisterklasse',
      shortCode: 'K1',
      category: 'Kür',
      level: 1
    }
  ];
  selectedExamList: Exam[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.eventForm = this.fb.group({
      name: [''],
      veranstalter: [''],
      place: [''],
      startDate: [''],
      endDate: [''],
      selectedExams: [[]] // For storing Exam objects
    });

    // Subscribe to changes in the selectedExams form control
    this.eventForm.get('selectedExams')?.valueChanges.subscribe((values: Exam[]) => {
      this.selectedExamList = values;
      console.log('Selected exams:', this.selectedExamList); // Debug log
    });
  }

  ngOnInit() {
    // Add validation for date range
    this.eventForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });

    this.eventForm.get('startDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });
  }

  validateDateRange() {
    const startDate = this.eventForm.get('startDate')?.value;
    const endDate = this.eventForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      
      if (end.isBefore(start)) {
        this.eventForm.get('endDate')?.setErrors({ 'invalidRange': true });
      } else {
        const currentErrors = this.eventForm.get('endDate')?.errors;
        if (currentErrors) {
          delete currentErrors['invalidRange'];
          this.eventForm.get('endDate')?.setErrors(
            Object.keys(currentErrors).length ? currentErrors : null
          );
        }
      }
    }
  }

  closeCreateNewEvent() {
    this.router.navigate(['/']);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const today = moment().startOf('day');
    const checkDate = moment(date);
    return checkDate.isSameOrAfter(today);
  };

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
    } else {
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Helper method to format exam display
  getSelectedExamsDisplay(): string {
    return this.selectedExamList
      .map(exam => `${exam.name} (${exam.shortCode})`)
      .join('\n');
  }
}
