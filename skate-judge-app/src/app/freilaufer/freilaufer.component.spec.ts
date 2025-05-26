import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreilauferComponent } from './freilaufer.component';

describe('FreilauferComponent', () => {
  let component: FreilauferComponent;
  let fixture: ComponentFixture<FreilauferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreilauferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreilauferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
