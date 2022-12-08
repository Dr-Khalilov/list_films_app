import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async get<T>(key: string): Promise<T> {
        return this.cacheManager.get<T>(key);
    }

    async set(key: string, value: object): Promise<void> {
        await this.cacheManager.set(key, value);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
