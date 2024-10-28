import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardReferralComponent } from './employee-dashboard-referral.component';

describe('EmployeeDashboardReferralComponent', () => {
  let component: EmployeeDashboardReferralComponent;
  let fixture: ComponentFixture<EmployeeDashboardReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDashboardReferralComponent]
    });
    fixture = TestBed.createComponent(EmployeeDashboardReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
