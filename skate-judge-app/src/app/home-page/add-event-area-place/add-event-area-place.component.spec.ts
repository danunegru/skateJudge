import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEventAreaPlaceComponent } from './add-event-area-place.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

// Test stub for Router
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('AddEventAreaPlaceComponent', () => {
  let component: AddEventAreaPlaceComponent;
  let fixture: ComponentFixture<AddEventAreaPlaceComponent>;
  let router: RouterStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule],
      declarations: [AddEventAreaPlaceComponent],
      providers: [{ provide: Router, useClass: RouterStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventAreaPlaceComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as RouterStub;
  });

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([
      { id: '1', name: 'Test Event', place: 'Berlin', startDate: '', endDate: '', veranstalter: '', selectedExams: [], prueflinge: [] }
    ]));
    spyOn(localStorage, 'setItem');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load events from localStorage on init', () => {
    component.ngOnInit();
    expect(component.events.length).toBe(1);
    expect(component.showInitialContent).toBeFalse();
  });

  it('should navigate to create event page', () => {
    component.openCreateNewEvent();
    expect(router.navigate).toHaveBeenCalledWith(['/create-event']);
  });

  it('should delete an event and update localStorage', () => {
    component.ngOnInit();
    component.deleteEvent(0);
    expect(component.events.length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(component.showInitialContent).toBeTrue();
  });

  it('should navigate to event details when ID is provided', () => {
    component.navigateToEventDetails('123');
    expect(router.navigate).toHaveBeenCalledWith(['/event', '123']);
  });

  it('should not navigate if eventId is undefined', () => {
    component.navigateToEventDetails(undefined);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('checkEvents should log current events', () => {
    spyOn(console, 'log');
    component.checkEvents();
    expect(console.log).toHaveBeenCalledWith('Current events:', component.events);
  });
});
