import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResumeScreeningListViewComponent } from './admin-resume-screening-list-view.component';

describe('AdminResumeScreeningListViewComponent', () => {
  let component: AdminResumeScreeningListViewComponent;
  let fixture: ComponentFixture<AdminResumeScreeningListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminResumeScreeningListViewComponent]
    });
    fixture = TestBed.createComponent(AdminResumeScreeningListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
