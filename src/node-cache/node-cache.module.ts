import { Module } from '@nestjs/common';
import { NodeCacheService } from './node-cache.service';

@Module({
    exports: [NodeCacheService],
    providers: [NodeCacheService],
})
export class NodeCacheModule {}
