import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2Component } from './p2.component';

describe('P2Component', () => {
  let component: P2Component;
  let fixture: ComponentFixture<P2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
