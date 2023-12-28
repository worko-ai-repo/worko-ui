import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralCancelledComponent } from './referral-cancelled.component';

describe('ReferralCancelledComponent', () => {
  let component: ReferralCancelledComponent;
  let fixture: ComponentFixture<ReferralCancelledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralCancelledComponent]
    });
    fixture = TestBed.createComponent(ReferralCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
