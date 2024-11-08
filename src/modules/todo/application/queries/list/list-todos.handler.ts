import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Span } from 'nestjs-otel';

import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { ListTodosQuery } from './list-todos.query';

@Injectable()
@QueryHandler(ListTodosQuery)
export class ListTodosHandler implements IQueryHandler<ListTodosQuery> {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  @Span('Handler')
  async execute(query: ListTodosQuery) {
    return await this.todoRepository.list(query.status, query.orderBy, query.page, query.pageSize);
  }
}
