import { ApiProperty } from '@nestjs/swagger';
import { IPageMetaParams } from '../interfaces/page-meta-params.interface';

export class PageMetaDto {
    @ApiProperty({ example: 1, description: 'The page of resource' })
    readonly page: number;

    @ApiProperty({ example: 10, description: 'Amount items for select' })
    readonly take: number;

    @ApiProperty({ example: 1000, description: 'Count items' })
    readonly itemCount: number;

    @ApiProperty({ example: 20, description: 'Page Count' })
    readonly pageCount: number;

    @ApiProperty({ example: false, description: 'Has previous page' })
    readonly hasPreviousPage: boolean;

    @ApiProperty({ example: true, description: 'Has next page' })
    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: IPageMetaParams) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
