import { TypeORMError } from 'typeorm';

import { ErrorMessages, ErrorStatus } from 'src/shared/core/constants/error.constant';
import { ErrorDtoBuilder } from '../../core/dtos/error-response.dto';
import { AbstractErrorHandler } from './abstract.error.handler';


export class TypeORMErrorHandler extends AbstractErrorHandler<TypeORMError> {
  constructor() {
    super(TypeORMError, ErrorStatus.INTERNAL_ERROR, ErrorMessages.DATABASE);
  }

  protected customizeErrorDtoBuilder(
    builder: ErrorDtoBuilder,
    error: TypeORMError,
  ): void {
    builder.setDetail(error.message);
  }
}