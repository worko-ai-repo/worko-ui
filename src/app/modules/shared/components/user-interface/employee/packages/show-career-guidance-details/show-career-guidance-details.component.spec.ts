import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCareerGuidanceDetailsComponent } from './show-career-guidance-details.component';

describe('ShowCareerGuidanceDetailsComponent', () => {
  let component: ShowCareerGuidanceDetailsComponent;
  let fixture: ComponentFixture<ShowCareerGuidanceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowCareerGuidanceDetailsComponent]
    });
    fixture = TestBed.createComponent(ShowCareerGuidanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
