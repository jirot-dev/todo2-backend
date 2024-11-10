import { HttpException } from '@nestjs/common';
import { AbstractErrorHandler } from './base.error.handler';
import { ErrorDtoBuilder } from '../../core/dtos/error.dto';
import { ErrorMessages, ErrorStatus } from '../constants/error-constants';

export class HttpExceptionHandler extends AbstractErrorHandler<Error> {
  constructor() {
    super(HttpException, ErrorStatus.INTERNAL_ERROR, ErrorMessages.INTERNAL);
  }

  protected customizeBuilder(
    builder: ErrorDtoBuilder,
    error: HttpException,
  ): void {
    const response = error.getResponse();
    builder.setMessage(typeof response === 'object' ? response['message'] : response);
  }
}