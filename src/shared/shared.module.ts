import {
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmRepository } from './models/films/film.repository';
import { FilmService } from './models/films/film.service';
import { FilmController } from './models/films/film.controller';
import { RedisCacheService } from './redis-cache/redis-cache.service';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { NodeCacheService } from './node-cache/node-cache.service';
import { NodeCacheModule } from './node-cache/node-cache.module';

const repositories: DynamicModule = TypeOrmModule.forFeature([FilmRepository]);

const services = [FilmService, RedisCacheService, NodeCacheService];

const controllers = [FilmController];

@Module({
    imports: [ConfigModule, RedisCacheModule, NodeCacheModule, repositories],
    controllers: [...controllers],
    providers: [...services],
    exports: [...services],
})
export class SharedModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply().forRoutes(...controllers);
    }
}
