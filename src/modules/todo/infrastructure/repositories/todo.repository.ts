import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Span } from 'nestjs-otel';

import { GenericRepository } from 'src/shared/base/infrastructure/repositories/generic.repository';
import { TodoEntity } from '../entities/todo.entity';
import { Todo } from '../../domain/models/todo.model';
import { TodoStatus, TodoPriority, TodoOrder } from '../../domain/enums/enum';

@Injectable()
@Injectable()
export class TodoRepository extends GenericRepository<Todo, TodoEntity> {
    constructor(
        @InjectRepository(TodoEntity)
        repository: Repository<TodoEntity>
    ) {
        super(repository, TodoEntity, Todo);
    }

    @Span('Repository.List')
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
            queryBuilder.orderBy(`todo.created_at`, 'ASC');
        } else if (orderBy === TodoOrder.DUE_DATE) {
            queryBuilder.orderBy(`todo.due_date`, 'ASC').orderBy(`todo.position`, 'ASC');
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

}