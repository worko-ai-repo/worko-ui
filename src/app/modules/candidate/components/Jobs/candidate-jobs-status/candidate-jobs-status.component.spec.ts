import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobsStatusComponent } from './candidate-jobs-status.component';

describe('CandidateJobsStatusComponent', () => {
  let component: CandidateJobsStatusComponent;
  let fixture: ComponentFixture<CandidateJobsStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateJobsStatusComponent]
    });
    fixture = TestBed.createComponent(CandidateJobsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
