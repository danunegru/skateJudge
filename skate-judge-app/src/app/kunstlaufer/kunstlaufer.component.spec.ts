import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KunstlauferComponent } from './kunstlaufer.component';

describe('KunstlauferComponent', () => {
  let component: KunstlauferComponent;
  let fixture: ComponentFixture<KunstlauferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KunstlauferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KunstlauferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
