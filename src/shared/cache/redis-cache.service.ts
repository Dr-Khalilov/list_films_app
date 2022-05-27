import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheResponse } from '../common/enums/cache-response.enum';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async clearCache() {
        const keys: string[] = await this.cacheManager.store.keys();
        keys.forEach(key =>
            key.startsWith(CacheResponse.GET_FILM_TITLE_CACHE)
                ? this.cacheManager.del(key)
                : null,
        );
    }

    async get(key): Promise<string> {
        return await this.cacheManager.get(key);
    }

    async getMany(keys: string[]): Promise<string[]> {
        return await this.cacheManager.wrap(...keys);
    }

    async set(key, value) {
        await this.cacheManager.set(key, value);
    }
}
