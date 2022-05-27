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

const repositories: DynamicModule = TypeOrmModule.forFeature([FilmRepository]);

const services = [FilmService];

const controllers = [FilmController];

@Module({
    imports: [ConfigModule, repositories],
    controllers: [...controllers],
    providers: [...services],
    exports: [...services],
})
export class SharedModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply().forRoutes(...controllers);
    }
}
