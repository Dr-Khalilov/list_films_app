import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NodeCacheService {
    private readonly cache: object;

    constructor() {
        this.cache = {};
    }

    public setCache(key: string, value: object): void {
        this.cache[key] = value;
    }

    public getCache(key: string): object {
        return this.cache[key];
    }

    public isHasCache(key: string): boolean {
        return this.cache.hasOwnProperty(key);
    }

    public deleteCacheByKey(key: string): void {
        delete this.cache[key];
    }

    public autoDeleteAfterSetPeriodOfTime(key: string, ttl = 15) {
        ttl *= 1000;
        setTimeout(() => this.deleteCacheByKey(key), ttl);
    }

    public getDataFromCache(): object {
        const data: object = this.cache;
        if (!this.isEmpty(data)) {
            throw new NotFoundException('No data from Node cache');
        }
        return data;
    }

    private isEmpty(obj: object): boolean {
        let response: boolean;
        Object.keys(obj).forEach(prop =>
            obj.hasOwnProperty(prop) ? (response = true) : (response = false),
        );
        return response;
    }
}
