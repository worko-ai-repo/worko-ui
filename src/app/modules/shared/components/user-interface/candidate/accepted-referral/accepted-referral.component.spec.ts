import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedReferralComponent } from './accepted-referral.component';

describe('AcceptedReferralComponent', () => {
  let component: AcceptedReferralComponent;
  let fixture: ComponentFixture<AcceptedReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptedReferralComponent]
    });
    fixture = TestBed.createComponent(AcceptedReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
