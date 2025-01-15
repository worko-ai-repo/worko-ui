import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeScreeningListViewComponent } from './resume-screening-list-view.component';

describe('ResumeScreeningListViewComponent', () => {
  let component: ResumeScreeningListViewComponent;
  let fixture: ComponentFixture<ResumeScreeningListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeScreeningListViewComponent]
    });
    fixture = TestBed.createComponent(ResumeScreeningListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
