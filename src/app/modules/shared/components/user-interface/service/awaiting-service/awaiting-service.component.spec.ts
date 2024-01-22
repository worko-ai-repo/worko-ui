import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingServiceComponent } from './awaiting-service.component';

describe('AwaitingServiceComponent', () => {
  let component: AwaitingServiceComponent;
  let fixture: ComponentFixture<AwaitingServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwaitingServiceComponent]
    });
    fixture = TestBed.createComponent(AwaitingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
