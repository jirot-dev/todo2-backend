import { HttpException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { ErrorHandler } from './base.error.handler';

export class HttpExceptionHandler implements ErrorHandler {
    canHandle(error: unknown): boolean {
      return error instanceof HttpException;
    }
  
    handle(error: HttpException, request: Request, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
      const status = error.getStatus();
      const response = error.getResponse();
  
      return new ErrorDtoBuilder(request.url)
        .setStatus(status)
        .setMessage(typeof response === 'object' ? response['message'] : response)
        .build();
    }
}