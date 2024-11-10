import { I18nService } from 'nestjs-i18n';
import { AbstractErrorHandler, MessageArgsHandler } from '../handlers/base.error.handler';
import { ErrorMessages, ErrorStatus } from '../constants/error-constant';
import { ValidationError } from '../exceptions/validation.error';


export class ValidationErrorHandler extends AbstractErrorHandler<ValidationError> {
    constructor() {
      super(ValidationError, ErrorStatus.BAD_REQUEST, ErrorMessages.ITEM_VALIDATION);
      
      this.messageArgsHandlers.push(new ValidationMessageArgsHandler());
    }
  }

  class ValidationMessageArgsHandler implements MessageArgsHandler {
    getMessageArgs(error: Error, request: any, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any> {
      if (!(error instanceof ValidationError)) {
        return baseArgs;
      }
  
      const fieldName = error.getFieldName();
  
      return {
        ...baseArgs,
        field: fieldName ? i18nService.translate(fieldName, {
          lang: request.i18nLang,
        }) : undefined
      };
    }
  }