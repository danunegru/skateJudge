import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K2Component } from './k2.component';

describe('K2Component', () => {
  let component: K2Component;
  let fixture: ComponentFixture<K2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
