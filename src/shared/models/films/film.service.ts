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

@Injectable()
export class FilmService {
    constructor(
        @InjectRepository(FilmRepository)
        private readonly filmRepository: FilmRepository,
        @Inject(RedisCacheService)
        private readonly redisCacheService: RedisCacheService,
    ) {}

    public async createFilm(data): Promise<FilmEntity> {
        const createdFilm = await this.filmRepository.save(data);
        if (!createdFilm) {
            throw new BadRequestException('The film not saved in database');
        }
        return createdFilm;
    }

    public async findFilmByTitle(title: string): Promise<FilmEntity> {
        const film = await this.filmRepository.findOne({ where: { title } });
        if (!film) {
            throw new NotFoundException('Film with this title not found');
        }
        // await this.redisCacheService.get(film);
        return film;
    }

    public async findAllFilms(query: IQuery): Promise<PaginateResponse> {
        const { page, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const data = await this.filmRepository.findAndCount({
            take: limit,
            skip: skip,
        });
        if (!data.length) {
            throw new NotFoundException('No films found in database');
        }
        return paginateResponse(data, page, limit);
    }
}
