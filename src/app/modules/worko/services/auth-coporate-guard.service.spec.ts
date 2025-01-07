import { TestBed } from '@angular/core/testing';

import { AuthCoporateGuardService } from './auth-coporate-guard.service';

describe('AuthCoporateGuardService', () => {
  let service: AuthCoporateGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthCoporateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
