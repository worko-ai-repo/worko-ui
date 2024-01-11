import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDoneComponent } from './referral-done.component';

describe('ReferralDoneComponent', () => {
  let component: ReferralDoneComponent;
  let fixture: ComponentFixture<ReferralDoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralDoneComponent]
    });
    fixture = TestBed.createComponent(ReferralDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
