import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCorporateComponent } from './admin-corporate.component';

describe('AdminCorporateComponent', () => {
  let component: AdminCorporateComponent;
  let fixture: ComponentFixture<AdminCorporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCorporateComponent]
    });
    fixture = TestBed.createComponent(AdminCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
