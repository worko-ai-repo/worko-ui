import { TestBed } from '@angular/core/testing';

import { AissuesService } from './aissues.service';

describe('AissuesService', () => {
  let service: AissuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AissuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
