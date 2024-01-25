import { TestBed } from '@angular/core/testing';

import { NavbarToggleSwitchService } from './navbar-toggle-switch.service';

describe('NavbarToggleSwitchService', () => {
  let service: NavbarToggleSwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarToggleSwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
