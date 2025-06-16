import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrueflingFormComponent } from './pruefling-form.component';

describe('PrueflingFormComponent', () => {
  let component: PrueflingFormComponent;
  let fixture: ComponentFixture<PrueflingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrueflingFormComponent]
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
