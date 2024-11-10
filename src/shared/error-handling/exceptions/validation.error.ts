import { ErrorStatus } from '../constants/error.constant';
import { ApplicationError } from './application.error';


export class ValidationError extends ApplicationError {
  constructor(
    messageKey: string,
    messageArgs?: Record<string, any>,
    private readonly fieldName?: string,
    subErrors?: ApplicationError[]
  ) {
    super(messageKey, messageArgs, ErrorStatus.BAD_REQUEST, subErrors);
  }

  getFieldName(): string | undefined {
    return this.fieldName;
  }
}