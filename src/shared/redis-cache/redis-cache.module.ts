import {
    CACHE_MANAGER,
    CacheModule,
    Inject,
    Logger,
    Module,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { RedisCacheService } from './redis-cache.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<object> => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                ttl: configService.get<number>('CACHE_TTL'),
            }),
        }),
    ],
    providers: [RedisCacheService],
    exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public onModuleInit(): any {
        const logger = new Logger('Cache');
        const commands = ['get', 'set', 'del'];
        commands.forEach(commandName => {
            const oldCommand = this.cacheManager[commandName];
            this.cacheManager[commandName] = async (...args) => {
                const start = new Date();
                const result = await oldCommand.call(
                    this.cacheManager,
                    ...args,
                );
                const end = new Date();
                const duration = end.getTime() - start.getTime();
                args = args.slice(0, 2);
                logger.log(
                    `${commandName.toUpperCase()} ${args.map(
                        elem => elem.title,
                    )} - ${duration} ms`,
                );
                return result;
            };
        });
    }
}
