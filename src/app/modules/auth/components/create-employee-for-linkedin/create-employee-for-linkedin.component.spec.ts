import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeForLinkedinComponent } from './create-employee-for-linkedin.component';

describe('CreateEmployeeForLinkedinComponent', () => {
  let component: CreateEmployeeForLinkedinComponent;
  let fixture: ComponentFixture<CreateEmployeeForLinkedinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEmployeeForLinkedinComponent]
    });
    fixture = TestBed.createComponent(CreateEmployeeForLinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
