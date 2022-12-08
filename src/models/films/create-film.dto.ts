import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDto {
    @ApiProperty({ example: 'Matrix', description: 'The title of film' })
    @Length(2, 300, {
        message: 'title cannot be less 2 and more than 300 characters',
    })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title cannot be an empty' })
    readonly title: string;

    @ApiProperty({ example: 'blabla', description: 'The description of film' })
    @Length(10, 800, {
        message: 'body cannot be less 10 and more than 800 characters',
    })
    @IsString({ message: 'body must be a string' })
    @IsNotEmpty({ message: 'body cannot be an empty' })
    readonly body: string;
}
