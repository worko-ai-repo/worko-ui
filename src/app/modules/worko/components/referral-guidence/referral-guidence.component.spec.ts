import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralGuidenceComponent } from './referral-guidence.component';

describe('ReferralGuidenceComponent', () => {
  let component: ReferralGuidenceComponent;
  let fixture: ComponentFixture<ReferralGuidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralGuidenceComponent]
    });
    fixture = TestBed.createComponent(ReferralGuidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
