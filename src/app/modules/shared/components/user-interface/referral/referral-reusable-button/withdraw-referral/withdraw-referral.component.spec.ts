import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawReferralComponent } from './withdraw-referral.component';

describe('WithdrawReferralComponent', () => {
  let component: WithdrawReferralComponent;
  let fixture: ComponentFixture<WithdrawReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawReferralComponent]
    });
    fixture = TestBed.createComponent(WithdrawReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
