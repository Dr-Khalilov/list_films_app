import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilmDto {
    @ApiProperty({ example: 'Matrix', description: 'The title of film' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title cannot be an empty' })
    readonly title: string;

    @ApiProperty({ example: 'blabla', description: 'The description of film' })
    @IsString({ message: 'body must be a string' })
    @IsNotEmpty({ message: 'body cannot be an empty' })
    readonly body: string;
}
