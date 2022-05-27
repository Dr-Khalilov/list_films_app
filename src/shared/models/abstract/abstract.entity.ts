import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractEntity extends BaseEntity {
    @ApiProperty({ example: 1, description: 'Unique identification' })
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @ApiProperty({ example: new Date(), description: 'Created at' })
    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    public createdAt: Date;

    @ApiProperty({ example: new Date(), description: 'Updated at' })
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    public updatedAt: Date;
}
