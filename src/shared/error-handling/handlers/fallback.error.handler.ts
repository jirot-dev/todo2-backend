import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { ErrorHandler } from './base.error.handler';

export class FallbackErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return true;
  }

  handle(error: unknown, request: any, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
    return new ErrorDtoBuilder(request.url)
      .setStatus(HttpStatus.INTERNAL_SERVER_ERROR)
      .setMessage(i18nService.translate('errors.internal', { lang: request.i18nLang }))
      .setDetail(error instanceof Error ? error.stack : String(error))
      .build();
  }
}