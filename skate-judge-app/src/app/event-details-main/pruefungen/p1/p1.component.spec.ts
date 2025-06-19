import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P1Component } from './p1.component';

describe('P1Component', () => {
  let component: P1Component;
  let fixture: ComponentFixture<P1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
