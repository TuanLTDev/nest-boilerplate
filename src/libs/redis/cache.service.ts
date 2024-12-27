import { Injectable } from '@nestjs/common';
import type { Cache, Store } from 'cache-manager';

@Injectable()
export class CacheService {
  private store: Store;

  constructor(private readonly cacheService: Cache) {
    this.store = this.cacheService.store;
  }
}
