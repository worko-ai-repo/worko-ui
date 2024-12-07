import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserForCorporateComponent } from './login-user-for-corporate.component';

describe('LoginUserForCorporateComponent', () => {
  let component: LoginUserForCorporateComponent;
  let fixture: ComponentFixture<LoginUserForCorporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginUserForCorporateComponent]
    });
    fixture = TestBed.createComponent(LoginUserForCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
