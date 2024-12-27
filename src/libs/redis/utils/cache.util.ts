import { CacheKey } from '@core/constants/cache.constant';
import * as util from 'node:util';

export const createCacheKey = (key: CacheKey, ...args: string[]): string => {
  return util.format(key, ...args);
};
