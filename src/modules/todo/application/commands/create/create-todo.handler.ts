import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { CreateTodoCommand } from './create-todo.command';

@Injectable()
@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  async execute(command: CreateTodoCommand) {
    const todo = new Todo();
    todo.merge(command as Partial<Todo>);
    return await this.todoRepository.create(todo);
  }
}
