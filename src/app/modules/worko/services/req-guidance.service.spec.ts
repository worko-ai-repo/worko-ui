import { TestBed } from '@angular/core/testing';

import { ReqGuidanceService } from './req-guidance.service';

describe('ReqGuidanceService', () => {
  let service: ReqGuidanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReqGuidanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
