import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract/abstract.entity';

@Entity('films')
export class FilmEntity extends AbstractEntity {
    @ApiProperty({ example: 'Matrix', description: 'The title of film' })
    @Column({ type: 'varchar', unique: true, length: 300, nullable: false })
    readonly title: string;

    @ApiProperty({ example: 'blabla', description: 'The description of film' })
    @Column({ type: 'text', nullable: false })
    readonly body: string;

    constructor(partialData: Partial<FilmEntity>) {
        super();
        Object.assign(this, partialData);
    }
}
