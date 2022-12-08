import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../../redis-cache/redis-cache.module';
import { NodeCacheModule } from '../../node-cache/node-cache.module';
import { FilmEntity } from './film.entity';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([FilmEntity]),
        RedisCacheModule,
        NodeCacheModule,
    ],
    controllers: [FilmController],
    providers: [FilmService],
    exports: [FilmService],
})
export class FilmModule {}
