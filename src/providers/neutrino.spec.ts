import { TestBed, inject } from '@angular/core/testing';

import { ElectronProviderService } from './electron-provider.service';

describe('ElectronProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronProviderService]
    });
  });

  it('should be created', inject([ElectronProviderService], (service: ElectronProviderService) => {
    expect(service).toBeTruthy();
  }));
});
