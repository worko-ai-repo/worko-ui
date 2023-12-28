import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeServicePackageComponent } from './employee-service-package.component';

describe('EmployeeServicePackageComponent', () => {
  let component: EmployeeServicePackageComponent;
  let fixture: ComponentFixture<EmployeeServicePackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeServicePackageComponent]
    });
    fixture = TestBed.createComponent(EmployeeServicePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
