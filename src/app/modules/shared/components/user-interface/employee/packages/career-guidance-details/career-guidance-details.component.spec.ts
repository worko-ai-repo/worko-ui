import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerGuidanceDetailsComponent } from './career-guidance-details.component';

describe('CareerGuidanceDetailsComponent', () => {
  let component: CareerGuidanceDetailsComponent;
  let fixture: ComponentFixture<CareerGuidanceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerGuidanceDetailsComponent]
    });
    fixture = TestBed.createComponent(CareerGuidanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
