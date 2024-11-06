import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoEntity } from './infrastructure/entities/todo.entity';
import { TodoRepository } from './infrastructure/repositories/todo.repository';
import { DateService } from 'src/shared/core/services/date.service';
import { CreateTodoHandler } from './application/commands/create/create-todo.handler';
import { UpdateTodoHandler } from './application/commands/update/update-todo.handler';
import { DeleteTodoHandler } from './application/commands/delete/delete-todo.handler';
import { GetTodoHandler } from './application/queries/get/get-todo.handler';
import { ListTodosHandler } from './application/queries/list/list-todos.handler';
import { TodoControllerV1 } from './presentation/v1/controllers/todo.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    CqrsModule
  ],
  controllers: [TodoControllerV1],
  providers: [
    DateService,
    TodoRepository,
    CreateTodoHandler,
    UpdateTodoHandler,
    DeleteTodoHandler,
    GetTodoHandler,
    ListTodosHandler,
  ],
  exports: [],
})
export class TodoModule {}
