import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilldeskResponseComponent } from './billdesk-response.component';

describe('BilldeskResponseComponent', () => {
  let component: BilldeskResponseComponent;
  let fixture: ComponentFixture<BilldeskResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BilldeskResponseComponent]
    });
    fixture = TestBed.createComponent(BilldeskResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
