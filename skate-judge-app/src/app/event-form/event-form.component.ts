import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup,
  AbstractControl, ValidationErrors, Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import {
  MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import moment from 'moment';
import { Router } from '@angular/router';
import { Event, Exam } from '../shared/models/event.interface';
import { TextFieldModule } from '@angular/cdk/text-field';
import { IndexedDbService } from '../shared/service/db/indexeddb.service';

export const GERMAN_DATE_FORMATS = {
  parse: { dateInput: 'DD.MM.YYYY' },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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

  examOptions: Exam[] = [
    { id: 'A1', name: 'Anfängerprüfung - Freiläufer', category: 'Anfänger' },
    { id: 'A2', name: 'Anfängerprüfung - Figurenläufer', category: 'Anfänger' },
    { id: 'A3', name: 'Anfängerprüfung - Kunstläufer', category: 'Anfänger' },
    { id: 'P4', name: 'Pflichtklasse 4', category: 'Pflicht' },
    { id: 'P3', name: 'Pflichtklasse 3', category: 'Pflicht' },
    { id: 'P2', name: 'Pflichtklasse 2', category: 'Pflicht' },
    { id: 'P1', name: 'Pflichtklasse 1', category: 'Pflicht' },
    { id: 'K4', name: 'Kürklasse 4', category: 'Kür' },
    { id: 'K3', name: 'Kürklasse 3 - Nachwuchsklasse', category: 'Kür' },
    { id: 'K2', name: 'Kürklasse 2 - Juniorenklasse', category: 'Kür' },
    { id: 'K1', name: 'Kürklasse 1 - Meisterklasse', category: 'Kür' },
  ];

  selectedExamList: Exam[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private indexedDb: IndexedDbService
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      veranstalter: ['', [Validators.required, this.capitalizedFirstLetterValidator()]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      place: ['', Validators.required],
      selectedExams: [[], Validators.required]
    });

    this.autoCapitalize('name');
    this.autoCapitalize('veranstalter');

    this.eventForm.get('selectedExams')?.valueChanges.subscribe((values: Exam[]) => {
      this.selectedExamList = values;
      console.log('📋 Ausgewählte Prüfungen:', this.selectedExamList);
    });
  }

  ngOnInit() {
    this.eventForm.get('startDate')?.valueChanges.subscribe(() => this.validateDateRange());
    this.eventForm.get('endDate')?.valueChanges.subscribe(() => this.validateDateRange());

    this.indexedDb.getAll<Event>('events').then(events => {
      console.log('📦 Bereits gespeicherte Events in IndexedDB:', events);
    });
  }

  validateDateRange() {
    const start = this.eventForm.get('startDate')?.value;
    const end = this.eventForm.get('endDate')?.value;
    if (start && end) {
      const startDate = moment(start);
      const endDate = moment(end);
      if (endDate.isBefore(startDate)) {
        this.eventForm.get('endDate')?.setErrors({ 'invalidRange': true });
      } else {
        const errors = this.eventForm.get('endDate')?.errors;
        if (errors) {
          delete errors['invalidRange'];
          this.eventForm.get('endDate')?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return moment(date).isSameOrAfter(moment().startOf('day'));
  };

  closeCreateNewEvent() {
    this.router.navigate(['/']);
  }

  async onSubmit() {
    if (this.eventForm.valid) {
      const raw = this.eventForm.value;

      const newEvent: Event = {
        id: crypto.randomUUID(),
        name: raw.name,
        veranstalter: raw.veranstalter,
        place: raw.place,
        startDate: moment(raw.startDate, 'YYYY-MM-DD').toDate(), // ✅ korrekter Date-Typ
        endDate: moment(raw.endDate, 'YYYY-MM-DD').toDate(),     // ✅ korrekter Date-Typ
        selectedExams: raw.selectedExams,
        prueflinge: []
      };

      console.log('✅ Neuer Event erstellt:', newEvent);

      try {
        await this.indexedDb.saveItem<Event>('events', newEvent);
        console.log('💾 Event wurde in IndexedDB gespeichert.');
        this.router.navigate(['/']);
      } catch (error) {
        console.error('❌ Fehler beim Speichern in IndexedDB:', error);
      }
    } else {
      Object.values(this.eventForm.controls).forEach(control => {
        if (control.invalid) control.markAsTouched();
      });
    }
  }

  getSelectedExamsDisplay(): string {
    return this.selectedExamList.map(e => `${e.name} (${e.id})`).join('\n');
  }

  private autoCapitalize(controlName: string) {
    this.eventForm.get(controlName)?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const capitalized = this.capitalizeFirstLetter(value);
        if (capitalized !== value) {
          this.eventForm.patchValue({ [controlName]: capitalized }, { emitEvent: false });
        }
      }
    });
  }

  private capitalizeFirstLetter(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  private capitalizedFirstLetterValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const val = control.value;
      if (!val) return null;
      return /^[A-ZÄÖÜ]/.test(val.charAt(0)) ? null : { capitalizedFirstLetter: true };
    };
  }
}