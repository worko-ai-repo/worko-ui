import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferEarnComponent } from './employee-refer-earn.component';

describe('EmployeeReferEarnComponent', () => {
  let component: EmployeeReferEarnComponent;
  let fixture: ComponentFixture<EmployeeReferEarnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeReferEarnComponent]
    });
    fixture = TestBed.createComponent(EmployeeReferEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
