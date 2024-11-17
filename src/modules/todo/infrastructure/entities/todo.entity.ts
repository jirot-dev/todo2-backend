import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn,  } from 'typeorm';

import { GenericEntity } from 'src/shared/base/infrastructure/entities/generic.entity';
import { TodoStatus, TodoPriority } from '../../domain/enums/enum';

@Entity({ name: 'todo' })
export class TodoEntity extends GenericEntity<TodoEntity> {
  @Column({ name: 'title', length: 250 })
  title: string;

  @Column({ name: 'detail', length: 2000, nullable: true })
  detail: string;

  @Column({ name: 'progress', type: 'int', default: 0 })
  progress: number;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date;

  @Column({ name: 'status', type: 'int', default: 0 })
  status: TodoStatus;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'priority', type: 'int', default: 1 })
  priority: TodoPriority;

  @Column({ name: 'position', type: 'int', nullable: true })
  position: number;

}
