import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventAreaPlaceComponent } from './add-event-area-place.component';

describe('AddEventAreaPlaceComponent', () => {
  let component: AddEventAreaPlaceComponent;
  let fixture: ComponentFixture<AddEventAreaPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventAreaPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventAreaPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
