
import { Span } from 'nestjs-otel';

import { IModel } from "../../domain/models/model";
import { IEntity } from "../entities/entity";
import { BaseRepository } from "./base.repository";
import { Repository } from 'typeorm';

export abstract class GenericRepository<TModel extends IModel, TEntity extends IEntity> 
extends BaseRepository<TModel, TEntity> {
    constructor(
        protected repository: Repository<TEntity>,
        private readonly entityType: new () => TEntity,
        private readonly modelType: new () => TModel
    ) {
        super(repository);
    }

    @Span('Repository.ToEntity')
    toEntity(model: TModel): TEntity {
        const entity = new this.entityType();
        const json = (model as any).toJson?.() ?? model;

        Object.keys(json)
            .forEach(key => {
                (entity as any)[key] = json[key];
            });

        return entity;
    }

    @Span('Repository.ToDomain')
    toDomain(entity: TEntity): TModel {
        const model = new this.modelType();
        (model as any).merge?.(entity) ?? Object.assign(model, entity);
        return model;
    }
}