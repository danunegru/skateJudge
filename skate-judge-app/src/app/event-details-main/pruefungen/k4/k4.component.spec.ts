import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K4Component } from './k4.component';

describe('K4Component', () => {
  let component: K4Component;
  let fixture: ComponentFixture<K4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
