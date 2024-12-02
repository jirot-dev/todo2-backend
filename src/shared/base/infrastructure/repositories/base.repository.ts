import { DeepPartial, Repository } from 'typeorm';
import { Span } from 'nestjs-otel';

import { NotFoundError } from '../../application/exceptions/not-found.error';
import { IModel } from '../../domain/models/model';
import { IRepository } from './repository';
import { IEntity } from '../entities/entity';
import { BaseEntity } from '../entities/base.entity';
import { ApplicationError } from '../../application/exceptions/application.error';
import { ErrorMessages } from '../../application/constants/error.constant';
import { UpdateValidationMode } from '../../domain/enums/update-validation-mode.enum';


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
        switch(model.updateValidationMode) {
            case UpdateValidationMode.No:
                this.updateNoCheck(model);
                break;
            case UpdateValidationMode.Token:
                this.updateByToken(model);
                break;
            case UpdateValidationMode.Lock:
            case UpdateValidationMode.LockOverride:
                this.updateByLock(model);
                break;
            default:
                this.updateNoCheck(model);
                break;
        }

        const updatedEntity = await this.repository.findOneBy({ id: model.id } as any);
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

    @Span('Repository.UpdateNoCheck')
    protected async updateNoCheck(model: TModel): Promise<void> {
        const entity = this.toEntity(model);
        
        const result = await this.repository
            .createQueryBuilder()
            .update(entity.constructor as typeof BaseEntity)
            .set(entity as DeepPartial<TEntity>)
            .where('id = :id', { id: entity.id })
            .execute();

        if (result.affected == 0) {
            throw new NotFoundError();
        }
    }

    @Span('Repository.UpdateByToken')
    protected async updateByToken(model: TModel): Promise<void> {
        const entity = this.toEntity(model);

        const result = await this.repository
            .createQueryBuilder()
            .update(entity.constructor as typeof BaseEntity)
            .set(entity as DeepPartial<TEntity>)
            .where('id = :id AND update_token = :updateTokenPrevious', { 
                id: entity.id, 
                updateTokenPrevious: model.updateTokenPrevious 
            })
            .execute();

        if (result.affected === 0) {
            throw new ApplicationError(ErrorMessages.ITEM_UPDATE_TOKEN);
        }
    }

    @Span('Repository.UpdateByLock')
    protected async updateByLock(model: TModel): Promise<void> {
        const now = new Date();
        const entity = this.toEntity(model);

        const result = await this.repository
            .createQueryBuilder()
            .update(entity.constructor as typeof BaseEntity)
            .set(entity as DeepPartial<TEntity>)
            .where('id = :id AND locked_by_id = :lockedById AND locked_expired >= :now', { 
                id: entity.id,
                lockedById: model.lockedById,
                now
            })
            .execute();

        if (result.affected === 0) {
            throw new ApplicationError(ErrorMessages.ITEM_UPDATE_LOCK);
        }
    }

    @Span('Repository.LockOrRelease')
    async lockOrRelease(model: TModel): Promise<void> {
        const now = new Date();
        const entity = this.toEntity(model);

        const result = await this.repository
            .createQueryBuilder()
            .update(entity.constructor as typeof BaseEntity)
            .set(entity as DeepPartial<TEntity>)
            .where('id = :id AND (locked_by_id IS NULL OR locked_by_id = :lockedById OR locked_expired < :now)', { 
                id: entity.id,
                lockedById: entity.lockedById,
                now
            })
            .execute();

        if (result.affected === 0) {
            throw new ApplicationError(ErrorMessages.ITEM_UPDATE_LOCK);
        }
    }
}