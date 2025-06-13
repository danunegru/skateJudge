import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewEventComponent } from './create-new-event.component';

describe('CreateNewEventComponent', () => {
  let component: CreateNewEventComponent;
  let fixture: ComponentFixture<CreateNewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}