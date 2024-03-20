import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequestBtnComponent } from './new-request-btn.component';

describe('NewRequestBtnComponent', () => {
  let component: NewRequestBtnComponent;
  let fixture: ComponentFixture<NewRequestBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRequestBtnComponent]
    });
    fixture = TestBed.createComponent(NewRequestBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
