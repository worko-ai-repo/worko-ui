import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInviteComponent } from './admin-invite.component';

describe('AdminInviteComponent', () => {
  let component: AdminInviteComponent;
  let fixture: ComponentFixture<AdminInviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInviteComponent]
    });
    fixture = TestBed.createComponent(AdminInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
