import { TestBed } from '@angular/core/testing';

import { ChamaService } from './chama.service';

describe('ChamaService', () => {
  let service: ChamaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
