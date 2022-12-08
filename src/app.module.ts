import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as Joi from 'joi';
import { TypeOrmConfigService } from './app/typeorm-config.service';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { NodeCacheModule } from './node-cache/node-cache.module';
import { FilmModule } from './models/films/film.module';
import { NODE_ENV } from './app/constants/app-constants.enum';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .required()
                    .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
                SERVER_PORT: Joi.number().required(),
                DEBUG_PORT: Joi.number().required(),
                DB_TYPE: Joi.string().required(),
                DB_URL: Joi.string().required(),
                REDIS_PORT: Joi.number().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_USERNAME: Joi.string().required(),
                REDIS_PASSWORD: Joi.string().required(),
                REDIS_COMMANDER_PORT: Joi.number().required(),
                CACHE_TTL: Joi.number().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        FilmModule,
        RedisCacheModule,
        NodeCacheModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private readonly dataSource: DataSource) {}
}
