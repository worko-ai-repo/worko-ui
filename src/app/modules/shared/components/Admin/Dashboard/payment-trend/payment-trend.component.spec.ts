import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTrendComponent } from './payment-trend.component';

describe('PaymentTrendComponent', () => {
  let component: PaymentTrendComponent;
  let fixture: ComponentFixture<PaymentTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTrendComponent]
    });
    fixture = TestBed.createComponent(PaymentTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
