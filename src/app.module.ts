import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SharedModule } from './shared/shared.module';
import { getTypeOrmConfigFactory } from './app.database.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                DB_TYPE: Joi.string().required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USER: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                TYPEORM_SYNC: Joi.boolean().required(),
                LOAD_ENTITIES: Joi.boolean().required(),
                REDIS_PORT: Joi.number().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_COMMANDER_PORT: Joi.number().required(),
                CACHE_TTL: Joi.number().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getTypeOrmConfigFactory,
        }),
        SharedModule,
    ],
})
export class AppModule {}
