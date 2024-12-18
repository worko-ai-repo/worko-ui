import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobsComponent } from './candidate-jobs.component';

describe('CandidateJobsComponent', () => {
  let component: CandidateJobsComponent;
  let fixture: ComponentFixture<CandidateJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateJobsComponent]
    });
    fixture = TestBed.createComponent(CandidateJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
