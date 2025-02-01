import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyRequestsComponentComponent } from './admin-company-requests-component.component';

describe('AdminCompanyRequestsComponentComponent', () => {
  let component: AdminCompanyRequestsComponentComponent;
  let fixture: ComponentFixture<AdminCompanyRequestsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCompanyRequestsComponentComponent]
    });
    fixture = TestBed.createComponent(AdminCompanyRequestsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
