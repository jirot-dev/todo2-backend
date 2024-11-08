import { TodoPriority } from '../../../domain/enums/enums';

export class UpdateTodoCommand {
  constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly detail?: string,
    public readonly progress?: number,
    public readonly dueDate?: Date,
    public readonly priority?: TodoPriority,
    public readonly position?: number,
  ) { }
}
