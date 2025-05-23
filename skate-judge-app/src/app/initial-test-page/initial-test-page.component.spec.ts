import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialTestPageComponent } from './initial-test-page.component';

describe('InitialTestPageComponent', () => {
  let component: InitialTestPageComponent;
  let fixture: ComponentFixture<InitialTestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialTestPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
