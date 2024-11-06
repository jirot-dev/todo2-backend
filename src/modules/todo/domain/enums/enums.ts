export enum TodoStatus {
  NOT_START = 0,
  PROGRESS = 1,
  FINISHED = 9
}
  
export enum TodoPriority {
  LOW = 1,
  MEDIUM = 5,
  HEIGHT = 10
}

export enum TodoOrder {
  CREATED_DATE = 'createdDate',
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority'
}