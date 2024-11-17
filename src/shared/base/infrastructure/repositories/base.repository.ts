import { DeepPartial, Repository } from 'typeorm';
import { Span } from 'nestjs-otel';

import { NotFoundError } from 'src/shared/core/exceptions/not-found.error';
import { IModel } from '../../domain/models/model';
import { IRepository } from './repository';
import { IEntity } from '../entities/entity';
import { BaseEntity } from '../entities/base.entity';


export abstract class BaseRepository<TModel extends IModel, TEntity extends IEntity> 
  implements IRepository<TModel, TEntity>{

    constructor(protected repository: Repository<TEntity>) {}

    @Span('Repository.Create')
    async create(model: TModel): Promise<TModel> {
        const entity = this.toEntity(model);
        const savedEntity = await this.repository.save(entity);
        return this.toDomain(savedEntity);
    }

    @Span('Repository.Update')
    async update(model: TModel): Promise<TModel> {
        const entity = this.toEntity(model);
        await this.repository
            .createQueryBuilder()
            .update(entity.constructor as typeof BaseEntity)
            .set(entity as DeepPartial<TEntity>)
            .where('id = :id', { id: entity.id })
            .execute();

        const updatedEntity = await this.repository.findOneBy({ id: entity.id } as any);
        if (!updatedEntity) {
            throw new NotFoundError();
        }

        return this.toDomain(updatedEntity);
    }

    @Span('Repository.Delete')
    async delete(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundError();
        }
    }

    @Span('Repository.GetById')
    async getById(id: string): Promise<TModel | null> {
        const entity = await this.repository.findOne({ where: { id } as any });
        return entity ? this.toDomain(entity) : null;
    }

    protected abstract toEntity(model: any): TEntity;

    protected abstract toDomain(entity: TEntity): any;
}