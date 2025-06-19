import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K1Component } from './k1.component';

describe('K1Component', () => {
  let component: K1Component;
  let fixture: ComponentFixture<K1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
