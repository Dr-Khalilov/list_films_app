import {
    CACHE_MANAGER,
    CacheModule,
    CacheModuleOptions,
    CacheStore,
    Inject,
    Logger,
    Module,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { RedisCacheService } from './redis-cache.service';

@Module({
    imports: [
        CacheModule.registerAsync<RedisClientOptions>({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                config: ConfigService,
            ): Promise<CacheModuleOptions> => {
                const store = await redisStore({
                    socket: {
                        host: config.get<string>('REDIS_HOST'),
                        port: +config.get<number>('REDIS_PORT'),
                    },
                    password: config.get<string>('REDIS_PASSWORD'),
                    username: config.get<string>('REDIS_USERNAME'),
                    ttl: +config.get<number>('CACHE_TTL'),
                });

                return {
                    store: store as unknown as CacheStore,
                };
            },
        }),
    ],
    providers: [RedisCacheService],
    exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public onModuleInit(): void {
        const logger = new Logger(RedisCacheModule.name);
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
