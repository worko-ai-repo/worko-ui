import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRejectedPopupComponent } from './referral-rejected-popup.component';

describe('ReferralRejectedPopupComponent', () => {
  let component: ReferralRejectedPopupComponent;
  let fixture: ComponentFixture<ReferralRejectedPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralRejectedPopupComponent]
    });
    fixture = TestBed.createComponent(ReferralRejectedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
