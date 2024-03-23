import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCardModalComponent } from './pay-card-modal.component';

describe('PayCardModalComponent', () => {
  let component: PayCardModalComponent;
  let fixture: ComponentFixture<PayCardModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayCardModalComponent]
    });
    fixture = TestBed.createComponent(PayCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
