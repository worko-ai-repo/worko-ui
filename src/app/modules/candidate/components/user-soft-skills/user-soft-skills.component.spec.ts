import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSoftSkillsComponent } from './user-soft-skills.component';

describe('UserSoftSkillsComponent', () => {
  let component: UserSoftSkillsComponent;
  let fixture: ComponentFixture<UserSoftSkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSoftSkillsComponent]
    });
    fixture = TestBed.createComponent(UserSoftSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
