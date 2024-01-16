import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneCareerGuidanceComponent } from './done-career-guidance.component';

describe('DoneCareerGuidanceComponent', () => {
  let component: DoneCareerGuidanceComponent;
  let fixture: ComponentFixture<DoneCareerGuidanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoneCareerGuidanceComponent]
    });
    fixture = TestBed.createComponent(DoneCareerGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
