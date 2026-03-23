import { TestBed } from '@angular/core/testing';

import { LugaresService} from './lugares';

describe('Lugares', () => {
  let service: LugaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LugaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
