import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDoneDetailsComponent } from './payment-done-details.component';

describe('PaymentDoneDetailsComponent', () => {
  let component: PaymentDoneDetailsComponent;
  let fixture: ComponentFixture<PaymentDoneDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDoneDetailsComponent]
    });
    fixture = TestBed.createComponent(PaymentDoneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
