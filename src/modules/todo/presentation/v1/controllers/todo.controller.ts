import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, Logger, ConsoleLogger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import short from 'short-uuid';

import { ContextInterceptor } from 'src/shared/core/interceptors/context.interceptor';
import { ApiResponses } from 'src/shared/core/decorators/api-responses.decorator';
import { ToUUID } from 'src/shared/core/decorators/to-uuid.decorator';
import { CreateTodoCommand } from '../../../application/commands/create/create-todo.command';
import { UpdateTodoCommand } from '../../../application/commands/update/update-todo.command';
import { DeleteTodoCommand } from '../../../application/commands/delete/delete-todo.command';
import { GetTodoQuery } from '../../../application/queries/get/get-todo.query';
import { ListTodosQuery } from '../../../application/queries/list/list-todos.query';
import { CreateTodoDtoV1, UpdateTodoDtoV1, ListTodoQueryDtoV1, ResponseTodoDtoV1 } from '../dtos/todo.dto';


@ApiTags('Todo')
@UseInterceptors(ContextInterceptor('todo'))
@Controller({ version: '1', path: 'todo' })
export class TodoControllerV1 {
  private logger = new Logger(TodoControllerV1.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Span()
  @OtelMethodCounter()
  @ApiOperation({operationId: 'listTodos'})
  @ApiQuery({ type: ListTodoQueryDtoV1 })
  @ApiResponses({ type: ResponseTodoDtoV1, successStatus: 200, isArray: true })
  @Get()
  async list(@Query() query: ListTodoQueryDtoV1) {
    this.logger.log('test');
    const { status, orderBy, page, pageSize } = query;
    const result = await this.queryBus.execute(new ListTodosQuery(status, orderBy, page, pageSize));
    result.items = result.items.map(todo => ResponseTodoDtoV1.fromDomain(todo));
    return result;
  }

  @Span()
  @OtelMethodCounter()
  @ApiOperation({operationId: 'getTodo'})
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponses({ type: ResponseTodoDtoV1, successStatus: 200, errorStatus: [404] })
  @Get(':id')
  async get(@ToUUID('id') id: string) {
    const todo = await this.queryBus.execute(new GetTodoQuery(id));
    return ResponseTodoDtoV1.fromDomain(todo);
  }

  @Span()
  @OtelMethodCounter()
  @ApiOperation({operationId: 'createTodo'})
  @ApiBody({ type: CreateTodoDtoV1 })
  @ApiResponses({ type: ResponseTodoDtoV1, successStatus: 201 })
  @Post()
  async create(@Body() dto: CreateTodoDtoV1) {
    const command = new CreateTodoCommand(
      dto.title,
      dto.detail,
      dto.progress,
      dto.dueDate,
      dto.priority,
      dto.position,
    );
    const todo = await this.commandBus.execute(command);
    return ResponseTodoDtoV1.fromDomain(todo);
  }

  @Span()
  @OtelMethodCounter()
  @ApiOperation({operationId: 'updateTodo'})
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateTodoDtoV1 })
  @ApiResponses({ type: ResponseTodoDtoV1, successStatus: 201, errorStatus: [404] })
  @Put(':id')
  async update(@ToUUID('id') id: string, @Body() dto: UpdateTodoDtoV1) {
    const command = new UpdateTodoCommand(
      id,
      dto.title,
      dto.detail,
      dto.progress,
      dto.dueDate,
      dto.priority,
      dto.position,
    );
    const todo = await this.commandBus.execute(command);
    return ResponseTodoDtoV1.fromDomain(todo);
  }

  @Span()
  @OtelMethodCounter()
  @ApiOperation({operationId: 'deleteTodo'})
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  async delete(@ToUUID('id') id: string) {
    const command = new DeleteTodoCommand(id);
    return await this.commandBus.execute(command);
  }
}
