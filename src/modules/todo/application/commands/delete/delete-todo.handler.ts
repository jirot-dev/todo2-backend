import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Span } from 'nestjs-otel';

import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { DeleteTodoCommand } from './delete-todo.command';

@Injectable()
@CommandHandler(DeleteTodoCommand)
export class DeleteTodoHandler implements ICommandHandler<DeleteTodoCommand> {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  @Span('Handler')
  async execute(command: DeleteTodoCommand) {
    return await this.todoRepository.delete(command.id);
  }
}
