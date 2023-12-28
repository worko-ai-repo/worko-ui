import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBankDetailsComponent } from './employee-bank-details.component';

describe('EmployeeBankDetailsComponent', () => {
  let component: EmployeeBankDetailsComponent;
  let fixture: ComponentFixture<EmployeeBankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeBankDetailsComponent]
    });
    fixture = TestBed.createComponent(EmployeeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
