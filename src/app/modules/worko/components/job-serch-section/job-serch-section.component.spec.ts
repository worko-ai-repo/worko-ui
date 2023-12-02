import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSerchSectionComponent } from './job-serch-section.component';

describe('JobSerchSectionComponent', () => {
  let component: JobSerchSectionComponent;
  let fixture: ComponentFixture<JobSerchSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobSerchSectionComponent]
    });
    fixture = TestBed.createComponent(JobSerchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
