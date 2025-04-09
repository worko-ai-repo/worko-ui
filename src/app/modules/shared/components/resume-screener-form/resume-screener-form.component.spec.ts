import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeScreenerFormComponent } from './resume-screener-form.component';

describe('ResumeScreenerFormComponent', () => {
  let component: ResumeScreenerFormComponent;
  let fixture: ComponentFixture<ResumeScreenerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeScreenerFormComponent]
    });
    fixture = TestBed.createComponent(ResumeScreenerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
