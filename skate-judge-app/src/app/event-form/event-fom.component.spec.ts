import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Location } from '@angular/common';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        TextFieldModule,
        BrowserAnimationsModule
      ],
      declarations: [EventFormComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.eventForm;
    expect(form).toBeTruthy();
    expect(form.get('name')?.value).toBe('');
    expect(form.get('selectedExams')?.value).toEqual([]);
  });

  it('should require name, veranstalter, place, startDate, and endDate', () => {
    const form = component.eventForm;
    form.patchValue({
      name: '',
      veranstalter: '',
      place: '',
      startDate: '',
      endDate: ''
    });
    expect(form.valid).toBeFalse();
    expect(form.get('name')?.errors?.['required']).toBeTrue();
    expect(form.get('veranstalter')?.errors?.['required']).toBeTrue();
  });

  it('should capitalize name and veranstalter fields', () => {
    const form = component.eventForm;
    form.get('name')?.setValue('event');
    form.get('veranstalter')?.setValue('max');

    // trigger valueChanges
    form.get('name')?.updateValueAndValidity();
    form.get('veranstalter')?.updateValueAndValidity();

    expect(form.get('name')?.value).toBe('Event');
    expect(form.get('veranstalter')?.value).toBe('Max');
  });

  it('should mark endDate as invalid if it is before startDate', () => {
    const form = component.eventForm;
    const start = new Date(2025, 5, 20);
    const end = new Date(2025, 5, 19);

    form.get('startDate')?.setValue(start);
    form.get('endDate')?.setValue(end);

    component.validateDateRange();

    expect(form.get('endDate')?.errors?.['invalidRange']).toBeTrue();
  });

  it('should save event to localStorage and navigate on valid form submission', () => {
    const form = component.eventForm;
    form.patchValue({
      name: 'Testevent',
      veranstalter: 'Veranstalter',
      place: 'Ort',
      startDate: new Date(),
      endDate: new Date(),
      selectedExams: []
    });

    spyOn(localStorage, 'getItem').and.returnValue('[]');
    const setItemSpy = spyOn(localStorage, 'setItem');

    component.onSubmit();

    expect(setItemSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not navigate if form is invalid', () => {
    const form = component.eventForm;
    form.patchValue({
      name: '', // Invalid
      veranstalter: 'Valid',
      place: 'Ort',
      startDate: new Date(),
      endDate: new Date(),
    });

    component.onSubmit();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
