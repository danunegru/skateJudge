import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
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
/**
 * Form component to create a new skating event.
 * Handles event meta-data, date validation, and exam selection.
 */
@Component({
  selector: 'app-event-form',
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
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
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
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;

  /** All exam types that can be assigned to an event. */

  examOptions: Exam[] = [
    {
      id: 'A1',
      name: 'Anfängerprüfung - Freiläufer',
      category: 'Anfänger'
    },
    {
      id: 'A2',
      name: 'Anfängerprüfung - Figurenläufer',
      category: 'Anfänger'
    },
    {
      id: 'A3',
      name: 'Anfängerprüfung - Kunstläufer',
      category: 'Anfänger'
    },
    {
      id: 'P4',
      name: 'Pflichtklasse 4',
      category: 'Pflicht'
    },
    {
      id: 'P3',
      name: 'Pflichtklasse 3',
      category: 'Pflicht'
    },
    {
      id: 'P2',
      name: 'Pflichtklasse 2',
      category: 'Pflicht'
    },
    {
      id: 'P1',
      name: 'Pflichtklasse 1',
      category: 'Pflicht'
    },
    {
      id: 'K4',
      name: 'Kürklasse 4',
      category: 'Kür'
    },
    {
      id: 'K3',
      name: 'Kürklasse 3 - Nachwuchsklasse',
      category: 'Kür'
    },
    {
      id: 'K2',
      name: 'Kürklasse 2 - Juniorenklasse',
      category: 'Kür'
    },
    {
      id: 'K1',
      name: 'Kürklasse 1 - Meisterklasse',
      category: 'Kür'
    }
  ];
  selectedExamList: Exam[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
       /* --------------------------------------------------------------------
     * Build the form with validation rules
     * ------------------------------------------------------------------ */
    this.eventForm = this.fb.group({
      name: ['', [
        Validators.required,
        this.capitalizeFirstLetterValidator()
      ]],
      veranstalter: ['', [
        Validators.required,
        this.capitalizeFirstLetterValidator()
      ]],
      place: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      selectedExams: [[]]
    });

    // Subscribe to name changes
    this.eventForm.get('name')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const capitalized = this.capitalizeFirstLetter(value);
        if (capitalized !== value) {
          this.eventForm.patchValue({ name: capitalized }, { emitEvent: false });
        }
      }
    });

    // Subscribe to veranstalter changes
    this.eventForm.get('veranstalter')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const capitalized = this.capitalizeFirstLetter(value);
        if (capitalized !== value) {
          this.eventForm.patchValue({ veranstalter: capitalized }, { emitEvent: false });
        }
      }
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

  // * Validation & utility logic
  
  /** Validates that the end date is not before the start date. */
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

   /**
   * Disable past dates in the datepicker.
   * @param date The date to evaluate.
   */
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
      .map(exam => `${exam.name} (${exam.id})`)
      .join('\n');
  }

  // Add these new methods
  private capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    const firstChar = value.charAt(0).toUpperCase();
    const restOfString = value.slice(1);
    return firstChar + restOfString;
  }

  private capitalizeFirstLetterValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const firstLetter = value.charAt(0);
      if (!/^[A-ZÄÖÜ]/.test(firstLetter)) {
        return { capitalizedFirstLetter: true };
      }
      return null;
    };
  }
}
