import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cacheKey';
export const CACHE_TTL = 'cacheTtl';
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY, key);
export const CacheTtl = (ttl: number) => SetMetadata(CACHE_TTL, ttl);
export const NoCache = () => SetMetadata('noCache', true);
