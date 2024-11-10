import { TypeORMError } from 'typeorm';
import { ErrorDtoBuilder } from '../../core/dtos/error.dto';
import { AbstractErrorHandler } from './base.error.handler';
import { ErrorMessages, ErrorStatus } from '../constants/error-constant';

export class TypeORMErrorHandler extends AbstractErrorHandler<TypeORMError> {
  constructor() {
    super(TypeORMError, ErrorStatus.INTERNAL_ERROR, ErrorMessages.DATABASE);
  }

  protected customizeBuilder(
    builder: ErrorDtoBuilder,
    error: TypeORMError,
  ): void {
    builder.setDetail(error.message);
  }
}