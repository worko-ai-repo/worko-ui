import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferralRejectComponent } from './employee-referral-reject.component';

describe('EmployeeReferralRejectComponent', () => {
  let component: EmployeeReferralRejectComponent;
  let fixture: ComponentFixture<EmployeeReferralRejectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeReferralRejectComponent]
    });
    fixture = TestBed.createComponent(EmployeeReferralRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
