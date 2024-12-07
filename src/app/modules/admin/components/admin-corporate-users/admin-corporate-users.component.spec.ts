import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCorporateUsersComponent } from './admin-corporate-users.component';

describe('AdminCorporateUsersComponent', () => {
  let component: AdminCorporateUsersComponent;
  let fixture: ComponentFixture<AdminCorporateUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCorporateUsersComponent]
    });
    fixture = TestBed.createComponent(AdminCorporateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
