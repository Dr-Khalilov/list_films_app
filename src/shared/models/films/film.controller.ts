import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Injectable,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { FilmEntity } from './film.entity';
import { FilmService } from './film.service';
import { NodeCacheService } from '../../node-cache/node-cache.service';
import { PaginateResponse } from '../../common/utils/paginate-response.dto';
import { FilmDto } from './film.dto';
import { IQuery } from './query.interface';

@ApiTags('Films')
@Injectable()
@Controller('/films')
export class FilmController {
    constructor(
        @Inject(FilmService) private readonly filmService: FilmService,
        @Inject(NodeCacheService)
        private readonly nodeCacheService: NodeCacheService,
    ) {}

    @ApiOperation({ summary: 'Create a film' })
    @ApiBadRequestResponse()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createOne(@Body() data: FilmDto): Promise<{ data: FilmEntity }> {
        const createdFilm: FilmEntity = await this.filmService.createFilm(data);
        return { data: createdFilm };
    }

    @ApiOperation({ summary: 'Find all films' })
    @ApiParam({ name: 'page', type: 'number', required: false })
    @ApiParam({ name: 'limit', type: 'number', required: false })
    @ApiOkResponse({ type: PaginateResponse })
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAllFilms(
        @Query() { page, limit }: IQuery,
    ): Promise<PaginateResponse> {
        return await this.filmService.findAllFilms({
            page: Number(!page || page <= 0 ? 1 : page),
            limit: Number(!limit || limit <= 0 || limit > 100 ? 100 : limit),
        });
    }

    @ApiOperation({ summary: 'All data from Node cache' })
    @ApiOkResponse({ type: FilmEntity })
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.OK)
    @Get('fetch-data-node-cache')
    async fetchDataFromNodeCache() {
        return this.nodeCacheService.getDataFromCache();
    }

    @ApiOperation({ summary: 'Find film by title' })
    @ApiParam({
        name: 'title',
        type: 'string',
        example: 'Matrix',
        required: true,
    })
    @ApiOkResponse({ type: FilmEntity })
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.OK)
    @Get('/:title')
    async findOne(
        @Param('title') title: string,
    ): Promise<{ data: object | string | FilmEntity }> {
        const foundFilm = await this.filmService.findFilmFromCacheOrDb(title);
        return { data: foundFilm };
    }
}
