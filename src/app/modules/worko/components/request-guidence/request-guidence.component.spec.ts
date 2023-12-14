import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGuidenceComponent } from './request-guidence.component';

describe('RequestGuidenceComponent', () => {
  let component: RequestGuidenceComponent;
  let fixture: ComponentFixture<RequestGuidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestGuidenceComponent]
    });
    fixture = TestBed.createComponent(RequestGuidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
