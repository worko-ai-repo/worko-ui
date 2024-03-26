import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqCandidateComponent } from './faq-candidate.component';

describe('FaqCandidateComponent', () => {
  let component: FaqCandidateComponent;
  let fixture: ComponentFixture<FaqCandidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaqCandidateComponent]
    });
    fixture = TestBed.createComponent(FaqCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
