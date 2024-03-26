import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqRefereeComponent } from './faq-referee.component';

describe('FaqRefereeComponent', () => {
  let component: FaqRefereeComponent;
  let fixture: ComponentFixture<FaqRefereeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaqRefereeComponent]
    });
    fixture = TestBed.createComponent(FaqRefereeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
