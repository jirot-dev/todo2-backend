import { ClsService, ClsStore } from 'nestjs-cls';
import { I18nService } from 'nestjs-i18n';
import { NotFoundError } from '../exceptions/not-found.error';
import { AbstractErrorHandler, MessageArgsHandler } from '../handlers/base.error.handler';
import { ErrorMessages, ErrorStatus } from '../constants/error-constants';


export class NotFoundErrorHandler extends AbstractErrorHandler<NotFoundError> {
  constructor(cls: ClsService<ClsStore>) {
    super(NotFoundError, ErrorStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);

    this.messageArgsHandlers.push(new NotFoundMessageArgsHandler(cls));
  }
}

class NotFoundMessageArgsHandler implements MessageArgsHandler {
  constructor(private readonly cls: ClsService<ClsStore>) {}

  getMessageArgs(error: Error, request: any, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any> {
    if (!(error instanceof NotFoundError)) {
      return baseArgs;
    }

    const resource = error.getResource() || this.cls.get('resource');
    const id = error.getId() || this.cls.get('resourceId');

    return {
      ...baseArgs,
      resource: resource ? i18nService.translate(`resources.${resource}`, {
        lang: request.i18nLang,
      }) : undefined,
      id
    };
  }
}