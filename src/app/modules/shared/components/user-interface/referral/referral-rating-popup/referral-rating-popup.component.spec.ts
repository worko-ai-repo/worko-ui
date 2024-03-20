import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRatingPopupComponent } from './referral-rating-popup.component';

describe('ReferralRatingPopupComponent', () => {
  let component: ReferralRatingPopupComponent;
  let fixture: ComponentFixture<ReferralRatingPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralRatingPopupComponent]
    });
    fixture = TestBed.createComponent(ReferralRatingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
