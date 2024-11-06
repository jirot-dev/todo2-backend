import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, Logger, ConsoleLogger } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AppLogger } from 'src/shared/logging/services/app-logger.logger';
import { API_PREFIX, API_V1 } from 'src/shared/core/constants/routes.constants';
import { ContextInterceptor } from 'src/shared/core/interceptors/context.interceptor';
import { ErrorDto } from 'src/shared/error-handling/dtos/error.dto';
import { CreateTodoCommand } from '../../../application/commands/create/create-todo.command';
import { UpdateTodoCommand } from '../../../application/commands/update/update-todo.command';
import { DeleteTodoCommand } from '../../../application/commands/delete/delete-todo.command';
import { GetTodoQuery } from '../../../application/queries/get/get-todo.query';
import { ListTodosQuery } from '../../../application/queries/list/list-todos.query';
import { CreateTodoDtoV1, UpdateTodoDtoV1, ListTodoQueryDtoV1, ResponseTodoDtoV1 } from '../dtos/todo.dto';


@ApiTags('todo')
@UseInterceptors(ContextInterceptor('Todo'))
@Controller(`${API_PREFIX}${API_V1}/todo`)
export class TodoControllerV1 {
  private logger = new Logger(TodoControllerV1.name);

  constructor(
    private readonly commandBus: CommandBus, 
    private readonly queryBus: QueryBus,
    private readonly cls: ClsService<ClsStore>
  ) 
  { }

  @Get()
  async list(@Query() query: ListTodoQueryDtoV1) {
    this.logger.log('test');
    const { status, orderBy, page, pageSize } = query;
    const result = await this.queryBus.execute(new ListTodosQuery(status, orderBy, page, pageSize));
    result.items = result.items.map(todo => ResponseTodoDtoV1.fromDomain(todo));
    return result;
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    const todo = await this.queryBus.execute(new GetTodoQuery(id));
    return ResponseTodoDtoV1.fromDomain(todo);
  }

  @ApiResponse({ status: 201, type: ResponseTodoDtoV1 })
  @ApiResponse({ status: 400, type: ErrorDto })
  @ApiResponse({ status: 500, type: ErrorDto })
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

  @ApiResponse({ status: 201, type: ResponseTodoDtoV1 })
  @ApiResponse({ status: 400, type: ErrorDto })
  @ApiResponse({ status: 404, type: ErrorDto })
  @ApiResponse({ status: 500, type: ErrorDto })
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTodoDtoV1) {
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

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const command = new DeleteTodoCommand(id);
    return await this.commandBus.execute(command);
  }
}