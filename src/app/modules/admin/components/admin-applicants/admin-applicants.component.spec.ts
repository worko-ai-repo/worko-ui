import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApplicantsComponent } from './admin-applicants.component';

describe('AdminApplicantsComponent', () => {
  let component: AdminApplicantsComponent;
  let fixture: ComponentFixture<AdminApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminApplicantsComponent]
    });
    fixture = TestBed.createComponent(AdminApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
