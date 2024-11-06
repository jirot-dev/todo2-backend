import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, SubErrorDto, ValidationErrorDto, ErrorDtoBuilder } from '../dtos/error.dto';
import { ValidationError } from '../exceptions/validation.error';
import { AggregateError } from '../exceptions/aggregate.error';
import { ErrorHandler } from '../handlers/base.error.handler';

export class AggregateErrorHandler implements ErrorHandler {
    canHandle(error: unknown): boolean {
      return error instanceof AggregateError;
    }
  
    handle(error: AggregateError, request: any, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
      const subErrors = error.errors.map(err => {
        const subError: SubErrorDto = {
          messageKey: err.messageKey,
          message: i18nService.translate(err.messageKey, {
            lang: request.i18nLang,
            args: err.messageArgs,
          })
        };
  
        // Only add fieldName if error is ValidationError
        if (err instanceof ValidationError && err.fieldName) {
          (subError as ValidationErrorDto).fieldName = err.fieldName;
        }
  
        return subError;
      });
  
      return new ErrorDtoBuilder(request.url)
        .setStatus(HttpStatus.BAD_REQUEST)
        .setMessage(i18nService.translate('errors.aggregate', { lang: request.i18nLang }))
        .addSubErrors(subErrors)
        .build();
    }
  }