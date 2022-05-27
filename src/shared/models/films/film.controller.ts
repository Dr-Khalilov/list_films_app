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
import { PaginateResponse } from '../utils/paginate-response.dto';
import { IQuery } from './query.interface';
import { FilmDto } from './film.dto';

@ApiTags('Films')
@Injectable()
@Controller('/films')
export class FilmController {
    constructor(
        @Inject(FilmService) private readonly filmService: FilmService,
    ) {}

    @ApiOperation({ summary: 'Create a film' })
    @ApiBadRequestResponse()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createOne(@Body() data: FilmDto): Promise<FilmEntity> {
        return await this.filmService.createFilm(data);
    }

    @ApiOperation({ summary: 'Find all films' })
    @ApiParam({ name: 'page', type: 'integer', required: false })
    @ApiParam({ name: 'limit', type: 'integer', required: false })
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
    async findOne(@Param('title') title: string): Promise<FilmEntity> {
        return await this.filmService.findFilmByTitle(title);
    }
}
