import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcandidateComponent } from './acandidate.component';

describe('AcandidateComponent', () => {
  let component: AcandidateComponent;
  let fixture: ComponentFixture<AcandidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcandidateComponent]
    });
    fixture = TestBed.createComponent(AcandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
