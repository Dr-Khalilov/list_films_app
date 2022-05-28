import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheResponse } from '../common/enums/cache-response.enum';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public async clearCache() {
        const keys: string[] = await this.cacheManager.store.keys();
        keys.forEach(key =>
            key.startsWith(CacheResponse.GET_FILM_TITLE_CACHE)
                ? this.del(key)
                : false,
        );
    }

    public async get(key: string): Promise<string> {
        return await this.cacheManager.get(key);
    }

    public async set(key: string, value: object): Promise<void> {
        await this.cacheManager.set(key, value, { ttl: 15 });
    }

    public async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
