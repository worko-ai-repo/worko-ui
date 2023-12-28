import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralReqRejectedComponent } from './referral-req-rejected.component';

describe('ReferralReqRejectedComponent', () => {
  let component: ReferralReqRejectedComponent;
  let fixture: ComponentFixture<ReferralReqRejectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralReqRejectedComponent]
    });
    fixture = TestBed.createComponent(ReferralReqRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
