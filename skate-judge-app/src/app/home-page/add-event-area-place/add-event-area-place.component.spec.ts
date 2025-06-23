import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AddEventAreaPlaceComponent } from './add-event-area-place.component';

describe('AddEventAreaPlaceComponent', () => {
  let component: AddEventAreaPlaceComponent;
  let fixture: ComponentFixture<AddEventAreaPlaceComponent>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddEventAreaPlaceComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventAreaPlaceComponent);
    component = fixture.componentInstance;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('[]');
    spyOn(localStorage, 'setItem');
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
