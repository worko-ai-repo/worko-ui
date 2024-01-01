import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferEarnStatusComponent } from './refer-earn-status.component';

describe('ReferEarnStatusComponent', () => {
  let component: ReferEarnStatusComponent;
  let fixture: ComponentFixture<ReferEarnStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferEarnStatusComponent]
    });
    fixture = TestBed.createComponent(ReferEarnStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
