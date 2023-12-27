import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileCompleteComponent } from './user-profile-complete.component';

describe('UserProfileCompleteComponent', () => {
  let component: UserProfileCompleteComponent;
  let fixture: ComponentFixture<UserProfileCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileCompleteComponent]
    });
    fixture = TestBed.createComponent(UserProfileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
