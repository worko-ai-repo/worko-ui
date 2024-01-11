import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferralDetailsComponent } from './employee-referral-details.component';

describe('EmployeeReferralDetailsComponent', () => {
  let component: EmployeeReferralDetailsComponent;
  let fixture: ComponentFixture<EmployeeReferralDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeReferralDetailsComponent]
    });
    fixture = TestBed.createComponent(EmployeeReferralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
