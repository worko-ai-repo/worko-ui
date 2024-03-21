import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralSeeReviewPopupComponent } from './referral-see-review-popup.component';

describe('ReferralSeeReviewPopupComponent', () => {
  let component: ReferralSeeReviewPopupComponent;
  let fixture: ComponentFixture<ReferralSeeReviewPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralSeeReviewPopupComponent]
    });
    fixture = TestBed.createComponent(ReferralSeeReviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
