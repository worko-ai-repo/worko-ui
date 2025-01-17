import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResumeMatchTableComponent } from './admin-resume-match-table.component';

describe('AdminResumeMatchTableComponent', () => {
  let component: AdminResumeMatchTableComponent;
  let fixture: ComponentFixture<AdminResumeMatchTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminResumeMatchTableComponent]
    });
    fixture = TestBed.createComponent(AdminResumeMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
