import { I18nService } from 'nestjs-i18n';

import { ErrorMessages, ErrorStatus } from 'src/shared/core/constants/error.constant';
import { ValidationError } from 'src/shared/core/exceptions/validation.error';
import { AbstractErrorHandler } from '../handlers/abstract.error.handler';
import { MessageArgsHandler } from '../interfaces/message-args-handler.interface';


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