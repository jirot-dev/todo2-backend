import { ErrorMessages, ErrorStatus } from '../constants/error-constant';
import { BaseError } from './base.error';


export class NotFoundError extends BaseError {
  constructor(
    private readonly resource?: string,
    private readonly id?: string | number
  ) {
    super(
      ErrorMessages.NOT_FOUND,
      { resource, id },
      ErrorStatus.NOT_FOUND,
      []
    );
  }

  getResource(): string | undefined {
    return this.resource;
  }

  getId(): string | number | undefined {
    return this.id;
  }
}