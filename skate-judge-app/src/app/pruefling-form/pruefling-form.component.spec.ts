import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PrueflingFormComponent } from './pruefling-form.component';

describe('PrueflingFormComponent', () => {
  let component: PrueflingFormComponent;
  let fixture: ComponentFixture<PrueflingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrueflingFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { eventId: 'test', exams: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrueflingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
