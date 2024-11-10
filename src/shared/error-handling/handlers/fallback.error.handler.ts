import { ErrorDtoBuilder } from '../../core/dtos/error.dto';
import { AbstractErrorHandler } from './base.error.handler';
import { ErrorMessages, ErrorStatus } from '../constants/error-constant';

export class FallbackErrorHandler extends AbstractErrorHandler<Error> {
  constructor() {
    super(Error, ErrorStatus.INTERNAL_ERROR, ErrorMessages.INTERNAL);
  }

  canHandle(error: unknown): boolean {
    return true;
  }

  protected customizeBuilder(
    builder: ErrorDtoBuilder,
    error: Error,
  ): void {
    builder.setDetail(error instanceof Error ? error.stack : String(error));
  }
}