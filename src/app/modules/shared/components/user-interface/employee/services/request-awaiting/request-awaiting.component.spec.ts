import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAwaitingComponent } from './request-awaiting.component';

describe('RequestAwaitingComponent', () => {
  let component: RequestAwaitingComponent;
  let fixture: ComponentFixture<RequestAwaitingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestAwaitingComponent]
    });
    fixture = TestBed.createComponent(RequestAwaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
