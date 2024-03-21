import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRejectDetailsPopupComponent } from './referral-reject-details-popup.component';

describe('ReferralRejectDetailsPopupComponent', () => {
  let component: ReferralRejectDetailsPopupComponent;
  let fixture: ComponentFixture<ReferralRejectDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralRejectDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(ReferralRejectDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
