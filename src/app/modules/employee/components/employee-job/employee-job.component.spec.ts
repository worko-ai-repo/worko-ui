import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeJobComponent } from './employee-job.component';

describe('EmployeeJobComponent', () => {
  let component: EmployeeJobComponent;
  let fixture: ComponentFixture<EmployeeJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeJobComponent]
    });
    fixture = TestBed.createComponent(EmployeeJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
