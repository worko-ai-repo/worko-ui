import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReferEarnComponent } from './admin-refer-earn.component';

describe('AdminReferEarnComponent', () => {
  let component: AdminReferEarnComponent;
  let fixture: ComponentFixture<AdminReferEarnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReferEarnComponent]
    });
    fixture = TestBed.createComponent(AdminReferEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
