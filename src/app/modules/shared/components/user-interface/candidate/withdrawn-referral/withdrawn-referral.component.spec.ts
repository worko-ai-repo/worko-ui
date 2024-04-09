import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnReferralComponent } from './withdrawn-referral.component';

describe('WithdrawnReferralComponent', () => {
  let component: WithdrawnReferralComponent;
  let fixture: ComponentFixture<WithdrawnReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawnReferralComponent]
    });
    fixture = TestBed.createComponent(WithdrawnReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
