import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResumeScreenerPageComponent } from './admin-resume-screener-page.component';

describe('AdminResumeScreenerPageComponent', () => {
  let component: AdminResumeScreenerPageComponent;
  let fixture: ComponentFixture<AdminResumeScreenerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminResumeScreenerPageComponent]
    });
    fixture = TestBed.createComponent(AdminResumeScreenerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
