import { TestBed } from '@angular/core/testing';

import { ProcessService } from './process.service';

describe('ProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessService = TestBed.get(ProcessService);
    expect(service).toBeTruthy();
  });
});
