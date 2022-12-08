import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractEntity extends BaseEntity {
    @ApiProperty({ example: 1, description: 'Primary key' })
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Created at',
    })
    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at',
    })
    readonly createdAt: Date;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Updated at',
    })
    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at',
    })
    readonly updatedAt: Date;
}
