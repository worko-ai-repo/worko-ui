import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmationModalComponent } from './payment-confirmation-modal.component';

describe('PaymentConfirmationModalComponent', () => {
  let component: PaymentConfirmationModalComponent;
  let fixture: ComponentFixture<PaymentConfirmationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentConfirmationModalComponent]
    });
    fixture = TestBed.createComponent(PaymentConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
