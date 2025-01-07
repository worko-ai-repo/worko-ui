import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateJobApplicationDetailComponent } from './corporate-job-application-detail.component';

describe('CorporateJobApplicationDetailComponent', () => {
  let component: CorporateJobApplicationDetailComponent;
  let fixture: ComponentFixture<CorporateJobApplicationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateJobApplicationDetailComponent]
    });
    fixture = TestBed.createComponent(CorporateJobApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
