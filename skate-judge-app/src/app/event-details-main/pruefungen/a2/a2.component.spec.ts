import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A2Component } from './a2.component';

describe('A2Component', () => {
  let component: A2Component;
  let fixture: ComponentFixture<A2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(A2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
