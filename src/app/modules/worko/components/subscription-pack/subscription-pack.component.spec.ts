import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackComponent } from './subscription-pack.component';

describe('SubscriptionPackComponent', () => {
  let component: SubscriptionPackComponent;
  let fixture: ComponentFixture<SubscriptionPackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionPackComponent]
    });
    fixture = TestBed.createComponent(SubscriptionPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
