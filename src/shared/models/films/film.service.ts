import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmRepository } from './film.repository';
import { FilmEntity } from './film.entity';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { NodeCacheService } from '../../node-cache/node-cache.service';
import { paginateResponse } from '../../common/utils/paginate-response.util';
import { PaginateResponse } from '../../common/utils/paginate-response.dto';
import { IQuery } from './query.interface';

@Injectable()
export class FilmService {
    constructor(
        @InjectRepository(FilmRepository)
        private readonly filmRepository: FilmRepository,
        @Inject(RedisCacheService)
        private readonly redisCacheService: RedisCacheService,
        @Inject(NodeCacheService)
        private readonly nodeCacheService: NodeCacheService,
    ) {}

    public async createFilm(data): Promise<FilmEntity> {
        const createdFilm: FilmEntity = await this.filmRepository.save(data);
        if (!createdFilm) {
            throw new BadRequestException('The film not saved in database');
        }
        return createdFilm;
    }

    public async findFilmByTitle(title: string): Promise<FilmEntity> {
        const film: FilmEntity = await this.filmRepository.findOne({
            where: { title },
        });
        if (!film) {
            throw new NotFoundException('Film with this title not found');
        }
        return film;
    }

    public async findFilmFromCacheOrDb(title: string) {
        if (this.nodeCacheService.hasCache(title)) {
            return this.nodeCacheService.getCache(title);
        }
        if (!this.nodeCacheService.hasCache(title)) {
            const filmFromRedisCache = await this.redisCacheService.get(title);
            if (filmFromRedisCache) {
                return filmFromRedisCache;
            }
            const filmFromDb = await this.findFilmByTitle(title);
            this.nodeCacheService.setCache(title, filmFromDb);
            await this.redisCacheService.set(title, filmFromDb);
            this.nodeCacheService.autoDeleteAfterSetPeriodOfTime(title, 15);
            return filmFromDb;
        }
    }

    public async findAllFilms(query: IQuery): Promise<PaginateResponse> {
        const { page, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const data: [FilmEntity[], number] =
            await this.filmRepository.findAndCount({
                take: limit,
                skip: skip,
            });
        if (!data.length) {
            throw new NotFoundException('No films found in database');
        }
        return paginateResponse(data, page, limit);
    }
}
