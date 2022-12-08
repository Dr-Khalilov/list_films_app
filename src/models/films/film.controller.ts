import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { FilmEntity } from './film.entity';
import { FilmService } from './film.service';
import { NodeCacheService } from '../../node-cache/node-cache.service';
import { CreateFilmDto } from './create-film.dto';
import { ApiPaginatedResponse } from '../../common/decorators/paginate-response.decorator';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@ApiTags('Films')
@Controller('/films')
export class FilmController {
    constructor(
        private readonly filmService: FilmService,
        private readonly nodeCacheService: NodeCacheService,
    ) {}

    @ApiOperation({ summary: 'Create a film' })
    @ApiCreatedResponse({ type: FilmEntity })
    @ApiBadRequestResponse()
    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    async createOne(@Body() data: CreateFilmDto): Promise<FilmEntity> {
        return this.filmService.createFilm(data);
    }

    @ApiOperation({ summary: 'Find all films' })
    @ApiPaginatedResponse(FilmEntity)
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async findMany(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<FilmEntity>> {
        return this.filmService.findAllFilms(pageOptionsDto);
    }

    @ApiOperation({ summary: 'All data from Node cache' })
    @ApiOkResponse({ type: FilmEntity })
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.OK)
    @Get('/node-cache')
    async fetchDataFromNodeCache(): Promise<object> {
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
    async findOne(@Param('title') title: string): Promise<FilmEntity> {
        return this.filmService.findFilmFromCacheOrDb(title);
    }
}
