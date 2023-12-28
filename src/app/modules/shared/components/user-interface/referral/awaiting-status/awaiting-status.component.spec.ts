import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingStatusComponent } from './awaiting-status.component';

describe('AwaitingStatusComponent', () => {
  let component: AwaitingStatusComponent;
  let fixture: ComponentFixture<AwaitingStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwaitingStatusComponent]
    });
    fixture = TestBed.createComponent(AwaitingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
