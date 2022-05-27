import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract/abstract.entity';

@Entity('films')
export class FilmEntity extends AbstractEntity {
    constructor(subscriptionData?: Partial<FilmEntity>) {
        super();
        Object.assign(this, subscriptionData);
    }

    @ApiProperty({ example: 'Matrix', description: 'The title of film' })
    @Column({ type: 'varchar', length: 300, nullable: false })
    public title: string;

    @ApiProperty({ example: 'blabla', description: 'The description of film' })
    @Column({ type: 'text', nullable: false })
    public body: string;
}
