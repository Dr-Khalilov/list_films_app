import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeCacheService {
    private readonly cache: Map<string, object>;

    constructor() {
        this.cache = new Map();
    }

    public getCache() {
        return this.cache;
    }
}
