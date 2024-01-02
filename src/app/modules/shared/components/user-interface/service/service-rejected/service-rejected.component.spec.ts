import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRejectedComponent } from './service-rejected.component';

describe('ServiceRejectedComponent', () => {
  let component: ServiceRejectedComponent;
  let fixture: ComponentFixture<ServiceRejectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRejectedComponent]
    });
    fixture = TestBed.createComponent(ServiceRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
