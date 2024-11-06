import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { TypeORMError } from 'typeorm';
import { ErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { ErrorHandler } from './base.error.handler';

export class TypeORMErrorHandler implements ErrorHandler {
    canHandle(error: unknown): boolean {
      return error instanceof TypeORMError;
    }
  
    handle(error: TypeORMError, request: any, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
      return new ErrorDtoBuilder(request.url)
        .setStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        .setMessage(i18nService.translate('errors.database', { lang: request.i18nLang }))
        .setDetail(error.message)
        .build();
    }
}