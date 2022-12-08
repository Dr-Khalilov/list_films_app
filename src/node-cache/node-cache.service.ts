import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NodeCacheService {
    private readonly cache: object;

    constructor() {
        this.cache = {};
    }

    async setCache(key: string, value: object): Promise<void> {
        this.cache[key] = value;
    }

    async getCache<T>(key: string): Promise<T> {
        return this.cache[key];
    }

    async hasCache(key: string): Promise<boolean> {
        return this.cache.hasOwnProperty(key);
    }

    async deleteCacheByKey(key: string): Promise<void> {
        delete this.cache[key];
    }

    async autoDeleteAfterSetPeriodOfTime(
        key: string,
        ttl: number,
    ): Promise<void> {
        ttl *= 1000;
        setTimeout(() => this.deleteCacheByKey(key), ttl);
    }

    async getDataFromCache(): Promise<object> {
        if (!(await this.isEmpty(this.cache))) {
            throw new NotFoundException('Data not found in Node cache');
        }
        return this.cache;
    }

    private async isEmpty(obj: object): Promise<boolean> {
        return Object.keys(obj).length > 0;
    }
}
