import { TestBed } from '@angular/core/testing';

import { CandidateDropdownService } from './candidate-dropdown.service';

describe('CandidateDropdownService', () => {
  let service: CandidateDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
