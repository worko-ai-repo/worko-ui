import { TestBed } from '@angular/core/testing';

import { AcandidateService } from './acandidate.service';

describe('AcandidateService', () => {
  let service: AcandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcandidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
