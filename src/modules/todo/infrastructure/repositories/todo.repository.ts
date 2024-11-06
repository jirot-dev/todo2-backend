import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/shared/base/repositories/base.repository';
import { TodoEntity } from '../entities/todo.entity';
import { Todo } from '../../domain/models/todo.model';
import { TodoStatus, TodoPriority, TodoOrder } from '../../domain/enums/enums';

@Injectable()
export class TodoRepository extends BaseRepository<TodoEntity> {
    constructor(
        @InjectRepository(TodoEntity)
        repository: Repository<TodoEntity>
    ) {
        super(repository);
    }

    async create(todo: Todo): Promise<Todo> {
        const entity = this.toEntity(todo);
        const savedEntity = await this.repository.save(entity);
        return this.toDomain(savedEntity);
    }

    async update(todo: Todo): Promise<Todo> {
        const entity = this.toEntity(todo);
        await this.repository
        .createQueryBuilder()
        .update(TodoEntity)
        .set(entity)
        .where('id = :id', { id: entity.id })
        .execute();
      
        return this.toDomain(await this.repository.findOneBy({ id: entity.id }));
    }

    async delete(id: number): Promise<void> {
        const result = await this.repository.delete(id);
        await this.throwIfNotDeleted(result);
    }

    async getById(id: number): Promise<Todo | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async list(
        status?: TodoStatus,
        orderBy: TodoOrder = TodoOrder.CREATED_DATE,
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ items: Todo[], total: number }> {
        const queryBuilder = this.repository.createQueryBuilder('todo');

        if (status !== undefined) {
            queryBuilder.where('todo.status = :status', { status });
        }

        if (orderBy === TodoOrder.CREATED_DATE) {
            queryBuilder.orderBy(`todo.createdDate`, 'ASC');
        } else if (orderBy === TodoOrder.DUE_DATE) {
            queryBuilder.orderBy(`todo.dueDate`, 'ASC').orderBy(`todo.position`, 'ASC');
        } else if (orderBy === TodoOrder.PRIORITY) {
            queryBuilder.orderBy(`todo.priority`, 'DESC').orderBy(`todo.position`, 'ASC');
        } 
        
        const [entities, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return {
            items: entities.map(entity => this.toDomain(entity)),
            total
        };
    }

    private toEntity(domain: Todo): TodoEntity {
        const entity = new TodoEntity();
        const json = domain.toJson();
        (Object.keys(json))
            .forEach((key) => {
                const value = json[key];
                (entity as any)[key] = value;
            });
        return entity;
    }

    private toDomain(entity: TodoEntity): Todo {
        const todo = new Todo();
        todo.merge(entity as Partial<Todo>);
        return todo;
    }
}