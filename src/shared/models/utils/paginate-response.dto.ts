import { ApiProperty } from '@nestjs/swagger';

export class PaginateResponse {
    @ApiProperty({ example: 'success', description: 'Status code' })
    readonly statusCode: string;

    @ApiProperty({ example: [{ some: 'some' }], description: 'Data' })
    readonly data: object[];

    @ApiProperty({ example: '30', description: 'Count items' })
    readonly count: number;

    @ApiProperty({ example: '20', description: 'Current page' })
    readonly currentPage: number;

    @ApiProperty({ example: '21', description: 'Next page' })
    readonly nextPage: number;

    @ApiProperty({ example: '19', description: 'Previous page' })
    readonly prevPage: number;

    @ApiProperty({ example: '40', description: 'Last page' })
    readonly lastPage: number;
}
