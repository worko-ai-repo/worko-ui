import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeReviewComponent } from './see-review.component';

describe('SeeReviewComponent', () => {
  let component: SeeReviewComponent;
  let fixture: ComponentFixture<SeeReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeReviewComponent]
    });
    fixture = TestBed.createComponent(SeeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
