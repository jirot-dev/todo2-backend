import { ErrorDtoBuilder } from '../../core/dtos/error-response.dto';
import { AbstractErrorHandler } from './abstract.error.handler';
import { ErrorMessages, ErrorStatus } from '../constants/error.constant';

export class DefaultErrorHandler extends AbstractErrorHandler<Error> {
  constructor() {
    super(Error, ErrorStatus.INTERNAL_ERROR, ErrorMessages.INTERNAL);
  }

  canHandle(error: unknown): boolean {
    return true;
  }

  protected customizeErrorDtoBuilder(
    builder: ErrorDtoBuilder,
    error: Error,
  ): void {
    builder.setDetail(error instanceof Error ? error.stack : String(error));
  }
}