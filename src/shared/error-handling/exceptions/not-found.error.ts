import { ErrorMessages, ErrorStatus } from '../constants/error.constant';
import { ApplicationError } from './application.error';


export class NotFoundError extends ApplicationError {
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