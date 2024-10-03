import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinJobPortalReferralFormComponent } from './min-job-portal-referral-form.component';

describe('MinJobPortalReferralFormComponent', () => {
  let component: MinJobPortalReferralFormComponent;
  let fixture: ComponentFixture<MinJobPortalReferralFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinJobPortalReferralFormComponent]
    });
    fixture = TestBed.createComponent(MinJobPortalReferralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
