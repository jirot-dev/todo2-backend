import { ErrorStatus } from '../constants/error-constants';
import { BaseError } from './base.error';


export class ValidationError extends BaseError {
  constructor(
    messageKey: string,
    messageArgs?: Record<string, any>,
    private readonly fieldName?: string,
    subErrors?: BaseError[]
  ) {
    super(messageKey, messageArgs, ErrorStatus.BAD_REQUEST, subErrors);
  }

  getFieldName(): string | undefined {
    return this.fieldName;
  }
}