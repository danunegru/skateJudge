import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryClassesPageComponent } from './mandatory-classes-page.component';

describe('MandatoryClassesPageComponent', () => {
  let component: MandatoryClassesPageComponent;
  let fixture: ComponentFixture<MandatoryClassesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandatoryClassesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatoryClassesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
