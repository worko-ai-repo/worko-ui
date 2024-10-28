import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardGuidanceComponent } from './employee-dashboard-guidance.component';

describe('EmployeeDashboardGuidanceComponent', () => {
  let component: EmployeeDashboardGuidanceComponent;
  let fixture: ComponentFixture<EmployeeDashboardGuidanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDashboardGuidanceComponent]
    });
    fixture = TestBed.createComponent(EmployeeDashboardGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
