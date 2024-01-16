import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalEarningComponent } from './total-earning.component';

describe('TotalEarningComponent', () => {
  let component: TotalEarningComponent;
  let fixture: ComponentFixture<TotalEarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalEarningComponent]
    });
    fixture = TestBed.createComponent(TotalEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
