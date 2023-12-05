import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralProgressBarComponent } from './referral-progress-bar.component';

describe('ReferralProgressBarComponent', () => {
  let component: ReferralProgressBarComponent;
  let fixture: ComponentFixture<ReferralProgressBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralProgressBarComponent]
    });
    fixture = TestBed.createComponent(ReferralProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
