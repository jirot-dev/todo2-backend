import { HttpException } from '@nestjs/common';
import { AbstractErrorHandler } from './abstract.error.handler';
import { ErrorDtoBuilder } from '../../core/dtos/error-response.dto';
import { ErrorMessages, ErrorStatus } from '../constants/error.constant';

export class HttpExceptionHandler extends AbstractErrorHandler<Error> {
  constructor() {
    super(HttpException, ErrorStatus.INTERNAL_ERROR, ErrorMessages.INTERNAL);
  }

  protected customizeErrorDtoBuilder(
    builder: ErrorDtoBuilder,
    error: HttpException,
  ): void {
    const response = error.getResponse();
    builder.setMessage(typeof response === 'object' ? response['message'] : response);
  }
}