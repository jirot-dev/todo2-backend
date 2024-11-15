import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Span } from 'nestjs-otel';

import { IdGenerateService } from 'src/shared/core/services/id-generate.service';
import { Todo } from '../../../domain/models/todo.model';
import { TodoRepository } from '../../../infrastructure/repositories/todo.repository';
import { CreateTodoCommand } from './create-todo.command';


@Injectable()
@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly idGenerateService: IdGenerateService
  ) { }

  @Span('Handler')
  async execute(command: CreateTodoCommand) {
    const id = this.idGenerateService.generateTimebaseId();
    const todo = new Todo();
    todo.merge({id, ...command} as Partial<Todo>);
    return await this.todoRepository.create(todo);
  }
}
