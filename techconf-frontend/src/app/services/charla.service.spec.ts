import { TestBed } from '@angular/core/testing';
import { CharlaService } from './charla.service';

describe('CharlaService', () => {
  let service: CharlaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharlaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
