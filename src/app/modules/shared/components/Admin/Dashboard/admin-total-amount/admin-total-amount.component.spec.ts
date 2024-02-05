import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTotalAmountComponent } from './admin-total-amount.component';

describe('AdminTotalAmountComponent', () => {
  let component: AdminTotalAmountComponent;
  let fixture: ComponentFixture<AdminTotalAmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTotalAmountComponent]
    });
    fixture = TestBed.createComponent(AdminTotalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
