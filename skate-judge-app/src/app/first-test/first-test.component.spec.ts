import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTestComponent } from './first-test.component';

describe('FirstTestComponent', () => {
  let component: FirstTestComponent;
  let fixture: ComponentFixture<FirstTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
