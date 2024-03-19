import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralReqDoneComponent } from './referral-req-done.component';

describe('ReferralReqDoneComponent', () => {
  let component: ReferralReqDoneComponent;
  let fixture: ComponentFixture<ReferralReqDoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralReqDoneComponent]
    });
    fixture = TestBed.createComponent(ReferralReqDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
