import { TestBed } from '@angular/core/testing';

import { SubscriptionPackService } from './subscription-pack.service';

describe('SubscriptionPackService', () => {
  let service: SubscriptionPackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionPackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
