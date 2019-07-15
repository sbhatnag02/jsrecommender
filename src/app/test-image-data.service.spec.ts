import { TestBed } from '@angular/core/testing';

import { TestImageDataService } from './test-image-data.service';

describe('TestImageDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestImageDataService = TestBed.get(TestImageDataService);
    expect(service).toBeTruthy();
  });
});
