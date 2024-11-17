import { IEntity } from '../entities/entity';
import { IModel } from '../../domain/models/model';

export interface IRepository<TModel extends IModel, TEntity extends IEntity> {
    create(model: TModel): Promise<TModel>;
    update(model: TModel): Promise<TModel>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<TModel | null>;
}