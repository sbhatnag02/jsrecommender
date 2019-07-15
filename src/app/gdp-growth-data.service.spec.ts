import { TestBed } from '@angular/core/testing';

import { GdpGrowthDataService } from './gdp-growth-data.service';

describe('GdpGrowthDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GdpGrowthDataService = TestBed.get(GdpGrowthDataService);
    expect(service).toBeTruthy();
  });
});
