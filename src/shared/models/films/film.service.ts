import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmRepository } from './film.repository';
import { FilmEntity } from './film.entity';
import { RedisCacheService } from '../../cache/redis-cache.service';
import { paginateResponse } from '../../common/utils/paginate-response.util';
import { PaginateResponse } from '../../common/utils/paginate-response.dto';
import { IQuery } from './query.interface';
import { CacheResponse } from '../../common/enums/cache-response.enum';

@Injectable()
export class FilmService {
    constructor(
        @InjectRepository(FilmRepository)
        private readonly filmRepository: FilmRepository,
        @Inject(RedisCacheService)
        private readonly redisCacheService: RedisCacheService,
    ) {}

    public async createFilm(data): Promise<FilmEntity> {
        const createdFilm: FilmEntity = await this.filmRepository.save(data);
        if (!createdFilm) {
            throw new BadRequestException('The film not saved in database');
        }
        await this.redisCacheService.clearCache();
        return createdFilm;
    }

    public async findFilmByTitle(title: string): Promise<FilmEntity> {
        const film: FilmEntity = await this.filmRepository.findOne({
            where: { title },
        });
        if (!film) {
            throw new NotFoundException('Film with this title not found');
        }
        await this.redisCacheService.set(
            CacheResponse.GET_FILM_TITLE_CACHE,
            film,
        );
        await this.redisCacheService.get(CacheResponse.GET_FILM_TITLE_CACHE);
        return film;
    }

    public async findAllFilms(query: IQuery): Promise<PaginateResponse> {
        const { page, limit } = query;
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
