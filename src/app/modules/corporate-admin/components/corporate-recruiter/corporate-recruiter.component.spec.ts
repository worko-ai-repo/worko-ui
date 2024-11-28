import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateRecruiterComponent } from './corporate-recruiter.component';

describe('CorporateRecruiterComponent', () => {
  let component: CorporateRecruiterComponent;
  let fixture: ComponentFixture<CorporateRecruiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateRecruiterComponent]
    });
    fixture = TestBed.createComponent(CorporateRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
