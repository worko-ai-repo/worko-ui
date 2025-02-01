import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddCompanyFormComponent } from './admin-add-company-form.component';

describe('AdminAddCompanyFormComponent', () => {
  let component: AdminAddCompanyFormComponent;
  let fixture: ComponentFixture<AdminAddCompanyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAddCompanyFormComponent]
    });
    fixture = TestBed.createComponent(AdminAddCompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
