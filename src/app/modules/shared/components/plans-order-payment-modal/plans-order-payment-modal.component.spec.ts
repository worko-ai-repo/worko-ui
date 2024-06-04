import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansOrderPaymentModalComponent } from './plans-order-payment-modal.component';

describe('PlansOrderPaymentModalComponent', () => {
  let component: PlansOrderPaymentModalComponent;
  let fixture: ComponentFixture<PlansOrderPaymentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlansOrderPaymentModalComponent]
    });
    fixture = TestBed.createComponent(PlansOrderPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
