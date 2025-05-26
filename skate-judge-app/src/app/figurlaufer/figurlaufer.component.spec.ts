import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigurlauferComponent } from './figurlaufer.component';

describe('FigurlauferComponent', () => {
  let component: FigurlauferComponent;
  let fixture: ComponentFixture<FigurlauferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FigurlauferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FigurlauferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
