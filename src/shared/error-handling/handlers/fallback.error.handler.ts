import { ErrorMessages, ErrorStatus } from 'src/shared/core/constants/error.constant';
import { ErrorDtoBuilder } from '../../core/dtos/error-response.dto';
import { AbstractErrorHandler } from './abstract.error.handler';


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