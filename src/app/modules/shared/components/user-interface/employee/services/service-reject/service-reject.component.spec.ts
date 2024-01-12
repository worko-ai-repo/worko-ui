import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRejectComponent } from './service-reject.component';

describe('ServiceRejectComponent', () => {
  let component: ServiceRejectComponent;
  let fixture: ComponentFixture<ServiceRejectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRejectComponent]
    });
    fixture = TestBed.createComponent(ServiceRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
