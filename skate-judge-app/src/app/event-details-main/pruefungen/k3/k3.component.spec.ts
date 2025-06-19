import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K3Component } from './k3.component';

describe('K3Component', () => {
  let component: K3Component;
  let fixture: ComponentFixture<K3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
