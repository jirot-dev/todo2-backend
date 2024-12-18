import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Span } from 'nestjs-otel';

import { NotFoundError } from 'src/shared/core/exceptions/not-found.error';
import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { UpdateTodoCommand } from './update-todo.command';


@Injectable()
@CommandHandler(UpdateTodoCommand)
export class UpdateTodoHandler implements ICommandHandler<UpdateTodoCommand> {
  constructor(
    private readonly todoRepository: TodoRepository
  ) { }

  @Span('Handler')
  async execute(command: UpdateTodoCommand) {
    const item = await this.todoRepository.getById(command.id);
    if (!item) {
      throw new NotFoundError();
    }

    item.merge(command as Partial<Todo>);
    return await this.todoRepository.update(item);
  }
}
