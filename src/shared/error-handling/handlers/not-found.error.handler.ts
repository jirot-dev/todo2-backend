import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { NotFoundError } from '../exceptions/not-found.error';
import { ErrorHandler } from '../handlers/base.error.handler';


export class NotFoundErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof NotFoundError;
  }

  handle(error: NotFoundError, request: any, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
    const resource = cls.get('resource');
    const resourceId = cls.get('resourceId');

    return new ErrorDtoBuilder(request.url)
      .setStatus(HttpStatus.NOT_FOUND)
      .setMessage(i18nService.translate(error.messageKey, {
        lang: request.i18nLang,
        args: {
          ...error.messageArgs,
          resource: error.messageArgs.resource || resource,
          id: error.messageArgs.id || resourceId
        },
      }))
      .build();
  }
}