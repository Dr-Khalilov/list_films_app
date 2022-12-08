import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { NODE_ENV } from './constants/app-constants.enum';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    @Inject(ConfigService)
    private readonly config: ConfigService;

    async createTypeOrmOptions(): Promise<TypeOrmModuleAsyncOptions> {
        return {
            type: this.config.get<string>('DB_TYPE'),
            url: this.config.get<string>('DB_URL'),
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            synchronize: this.config.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
            autoLoadEntities:
                this.config.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
            logging: false,
            retryDelay: 5000,
        } as TypeOrmModuleAsyncOptions;
    }
}
