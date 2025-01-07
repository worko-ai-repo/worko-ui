import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateApplicantsComponent } from './corporate-applicants.component';

describe('CorporateApplicantsComponent', () => {
  let component: CorporateApplicantsComponent;
  let fixture: ComponentFixture<CorporateApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateApplicantsComponent]
    });
    fixture = TestBed.createComponent(CorporateApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
