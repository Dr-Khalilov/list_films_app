import {
    CacheModule,
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { FilmRepository } from './models/films/film.repository';
import { FilmService } from './models/films/film.service';
import { FilmController } from './models/films/film.controller';
import { RedisCacheService } from './cache/redis-cache.service';

const repositories: DynamicModule = TypeOrmModule.forFeature([FilmRepository]);

const services = [FilmService, RedisCacheService];

const controllers = [FilmController];

@Module({
    imports: [
        ConfigModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                ttl: configService.get<number>('CACHE_TTL'),
            }),
        }),
        repositories,
    ],
    controllers: [...controllers],
    providers: [...services],
    exports: [...services],
})
export class SharedModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply().forRoutes(...controllers);
    }
}
