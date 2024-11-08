import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { BaseError } from '../exceptions/base.error';

export interface ErrorHandler {
  canHandle(error: unknown): boolean;
  handle(error: unknown, request: Request, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto;
}

export class BaseErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof BaseError;
  }

  handle(error: BaseError, request: any, i18nService: I18nService): ErrorDto {
    return new ErrorDtoBuilder(request.url)
      .setStatus(HttpStatus.BAD_REQUEST)
      .setMessage(i18nService.translate(error.messageKey, {
        lang: request.i18nLang,
        args: error.messageArgs,
      }))
      .build();
  }
}