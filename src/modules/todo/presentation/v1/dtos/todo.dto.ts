import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { TodoStatus, TodoPriority, TodoOrder } from '../../../domain/enums/enums';
import { Todo } from '../../../domain/models/todo.model';

class BaseTodoDtoV1 {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  detail?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priority?: TodoPriority;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class CreateTodoDtoV1 extends BaseTodoDtoV1 {
}

export class UpdateTodoDtoV1 extends BaseTodoDtoV1 {
}

export class ListTodoQueryDtoV1 {
  @ApiProperty({
    enum: TodoStatus,
    enumName: 'TodoStatus',
    description: 'NOT_START = 0, PROGRESS = 1, FINISHED = 9',
    required: false
  })
  status?: TodoStatus;

  @ApiProperty({
    enum: TodoOrder,
    enumName: 'TodoOrder',
    required: false,
    default: TodoOrder.CREATED_DATE
  })
  orderBy?: TodoOrder = TodoOrder.CREATED_DATE;

  @ApiProperty({
    type: Number,
    required: false,
    default: 1
  })
  page?: number = 1;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10
  })
  pageSize?: number = 10;
}

export class ResponseTodoDtoV1 {
  readonly id: number;
  readonly title: string;
  readonly detail: string | null;
  readonly progress: number;
  readonly startDate: Date | null;
  readonly endDate: Date | null;
  readonly status: TodoStatus;
  readonly dueDate: Date | null;
  readonly priority: TodoPriority;
  readonly position: number | null;
  readonly createdDate: Date;
  readonly modifiedDate: Date;

  static fromDomain(domain: Todo): ResponseTodoDtoV1 {
    return {
      id: domain.id,
      title: domain.title,
      detail: domain.detail,
      progress: domain.progress,
      startDate: domain.startDate,
      endDate: domain.endDate,
      status: domain.status,
      dueDate: domain.dueDate,
      priority: domain.priority,
      position: domain.position,
      createdDate: domain.createdDate,
      modifiedDate: domain.modifiedDate
    };
  }
}