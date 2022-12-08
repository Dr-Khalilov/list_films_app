import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from './film.entity';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { NodeCacheService } from '../../node-cache/node-cache.service';
import { CreateFilmDto } from './create-film.dto';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { typeReturn } from '../../common/utils/helpers.util';

@Injectable()
export class FilmService {
    constructor(
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
        private readonly redisCacheService: RedisCacheService,
        private readonly nodeCacheService: NodeCacheService,
    ) {}

    async createFilm(data: CreateFilmDto): Promise<FilmEntity> {
        const film = await this.filmRepository
            .createQueryBuilder('film')
            .where('film.title = :title', { title: data.title })
            .getOne();

        if (film) {
            throw new BadRequestException(
                `Film with that title: ${data.title} already exist`,
            );
        }
        return typeReturn<FilmEntity>(
            this.filmRepository
                .createQueryBuilder()
                .insert()
                .into(FilmEntity)
                .values(data)
                .returning('*')
                .execute(),
        );
    }

    async findFilmByTitle(title: string): Promise<FilmEntity> {
        const film = await this.filmRepository
            .createQueryBuilder('film')
            .where('film.title = :title', { title })
            .getOne();

        if (!film) {
            throw new NotFoundException(
                `Film with that title: ${title} not found`,
            );
        }
        return film;
    }

    async findFilmFromCacheOrDb(title: string): Promise<FilmEntity> {
        if (await this.nodeCacheService.hasCache(title)) {
            return this.nodeCacheService.getCache<FilmEntity>(title);
        }
        if (!(await this.nodeCacheService.hasCache(title))) {
            const filmFromRedisCache =
                await this.redisCacheService.get<FilmEntity>(title);
            if (filmFromRedisCache) {
                return filmFromRedisCache;
            }
            const filmFromDb = await this.findFilmByTitle(title);
            await this.nodeCacheService.setCache(title, filmFromDb);
            await this.redisCacheService.set(title, filmFromDb);
            await this.nodeCacheService.autoDeleteAfterSetPeriodOfTime(
                title,
                15,
            );
            return filmFromDb;
        }
    }

    async findAllFilms(
        pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<FilmEntity>> {
        const { take, skip, order } = pageOptionsDto;
        const [films, itemCount] = await this.filmRepository
            .createQueryBuilder('films')
            .orderBy('films.createdAt', order)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found films in database');
        }
        const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
        return new PaginationDto(films, pageMetaDto);
    }
}
