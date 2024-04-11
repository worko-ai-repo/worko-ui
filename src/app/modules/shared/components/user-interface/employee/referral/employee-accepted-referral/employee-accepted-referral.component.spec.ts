import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAcceptedReferralComponent } from './employee-accepted-referral.component';

describe('EmployeeAcceptedReferralComponent', () => {
  let component: EmployeeAcceptedReferralComponent;
  let fixture: ComponentFixture<EmployeeAcceptedReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAcceptedReferralComponent]
    });
    fixture = TestBed.createComponent(EmployeeAcceptedReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
