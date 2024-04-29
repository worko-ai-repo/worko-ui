import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedAnalysisComponent } from './detailed-analysis.component';

describe('DetailedAnalysisComponent', () => {
  let component: DetailedAnalysisComponent;
  let fixture: ComponentFixture<DetailedAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedAnalysisComponent]
    });
    fixture = TestBed.createComponent(DetailedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
