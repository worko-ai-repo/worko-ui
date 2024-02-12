import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAboutComponent } from './employee-about.component';

describe('EmployeeAboutComponent', () => {
  let component: EmployeeAboutComponent;
  let fixture: ComponentFixture<EmployeeAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAboutComponent]
    });
    fixture = TestBed.createComponent(EmployeeAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
