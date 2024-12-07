import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateJobsComponent } from './corporate-jobs.component';

describe('CorporateJobsComponent', () => {
  let component: CorporateJobsComponent;
  let fixture: ComponentFixture<CorporateJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateJobsComponent]
    });
    fixture = TestBed.createComponent(CorporateJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
