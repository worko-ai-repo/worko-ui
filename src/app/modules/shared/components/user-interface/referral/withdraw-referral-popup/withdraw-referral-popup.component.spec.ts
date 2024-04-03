import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawReferralPopupComponent } from './withdraw-referral-popup.component';

describe('WithdrawReferralPopupComponent', () => {
  let component: WithdrawReferralPopupComponent;
  let fixture: ComponentFixture<WithdrawReferralPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawReferralPopupComponent]
    });
    fixture = TestBed.createComponent(WithdrawReferralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
