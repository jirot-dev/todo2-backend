import { TodoStatus, TodoOrder } from '../../../domain/enums/enum';

export class ListTodosQuery {
  constructor(
    public readonly status?: TodoStatus,
    public readonly orderBy: TodoOrder = TodoOrder.CREATED_DATE,
    public readonly page: number = 1,
    public readonly pageSize: number = 10
  ) { }
}
