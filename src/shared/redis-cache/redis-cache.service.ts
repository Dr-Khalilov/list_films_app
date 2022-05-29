import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public async get(key: string): Promise<string> {
        return await this.cacheManager.get(key);
    }

    public async set(key: string, value: object): Promise<void> {
        await this.cacheManager.set(key, value);
    }

    public async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
