import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRaiseIssuePopupComponent } from './referral-raise-issue-popup.component';

describe('ReferralRaiseIssuePopupComponent', () => {
  let component: ReferralRaiseIssuePopupComponent;
  let fixture: ComponentFixture<ReferralRaiseIssuePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralRaiseIssuePopupComponent]
    });
    fixture = TestBed.createComponent(ReferralRaiseIssuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
