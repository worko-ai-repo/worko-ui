import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCandidateForLinkedinComponent } from './create-candidate-for-linkedin.component';

describe('CreateCandidateForLinkedinComponent', () => {
  let component: CreateCandidateForLinkedinComponent;
  let fixture: ComponentFixture<CreateCandidateForLinkedinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCandidateForLinkedinComponent]
    });
    fixture = TestBed.createComponent(CreateCandidateForLinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
