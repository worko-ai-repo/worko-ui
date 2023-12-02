import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenifitsSectionComponent } from './benifits-section.component';

describe('BenifitsSectionComponent', () => {
  let component: BenifitsSectionComponent;
  let fixture: ComponentFixture<BenifitsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BenifitsSectionComponent]
    });
    fixture = TestBed.createComponent(BenifitsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
