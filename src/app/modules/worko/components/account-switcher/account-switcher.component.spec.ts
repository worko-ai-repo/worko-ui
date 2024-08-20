import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSwitcherComponent } from './account-switcher.component';

describe('AccountSwitcherComponent', () => {
  let component: AccountSwitcherComponent;
  let fixture: ComponentFixture<AccountSwitcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSwitcherComponent]
    });
    fixture = TestBed.createComponent(AccountSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
