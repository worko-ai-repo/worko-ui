import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePackagesComponent } from './employee-packages.component';

describe('EmployeePackagesComponent', () => {
  let component: EmployeePackagesComponent;
  let fixture: ComponentFixture<EmployeePackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePackagesComponent]
    });
    fixture = TestBed.createComponent(EmployeePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
