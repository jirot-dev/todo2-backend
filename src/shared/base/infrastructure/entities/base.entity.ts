import { Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn,  } from 'typeorm';

import { IEntity } from "./entity";

export abstract class BaseEntity implements IEntity {
    @PrimaryColumn({ name: 'id', type: 'uuid'})
    id: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @Column({ name: 'created_by', length: 100, nullable: true })
    createdBy: string;

    @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
    createdById: string;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'updated_by', length: 100, nullable: true })
    updatedBy: string;

    @Column({ name: 'updated_by_id', type: 'uuid', nullable: true })
    updatedById: string;
}