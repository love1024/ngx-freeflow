import { TestBed } from '@angular/core/testing';

import { NgFreeflowLibService } from './ng-freeflow-lib.service';

describe('NgFreeflowLibService', () => {
  let service: NgFreeflowLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgFreeflowLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
