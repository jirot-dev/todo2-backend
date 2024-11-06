import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundError } from 'src/shared/error-handling/exceptions/not-found.error';
import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { GetTodoQuery } from './get-todo.query';


@Injectable()
@QueryHandler(GetTodoQuery)
export class GetTodoHandler implements IQueryHandler<GetTodoQuery> {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  async execute(query: GetTodoQuery) {
    const item = await this.todoRepository.getById(query.id);
    if (!item) {
      throw new NotFoundError();
    }
    return item;
  }
}
