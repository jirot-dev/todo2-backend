import { ClsService, ClsStore } from 'nestjs-cls';
import { I18nService } from 'nestjs-i18n';
import { NotFoundError } from '../exceptions/not-found.error';
import { AbstractErrorHandler } from '../handlers/abstract.error.handler';
import { MessageArgsHandler } from '../interfaces/message-args-handler.interface';
import { ErrorMessages, ErrorStatus } from '../constants/error.constant';


export class NotFoundErrorHandler extends AbstractErrorHandler<NotFoundError> {
  constructor(clsService: ClsService<ClsStore>) {
    super(NotFoundError, ErrorStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);

    this.messageArgsHandlers.push(new NotFoundMessageArgsHandler(clsService));
  }
}

class NotFoundMessageArgsHandler implements MessageArgsHandler {
  constructor(private readonly clsService: ClsService<ClsStore>) {}

  getMessageArgs(error: Error, request: any, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any> {
    if (!(error instanceof NotFoundError)) {
      return baseArgs;
    }

    const resource = error.getResource() || this.clsService.get('resource');
    const id = error.getId() || this.clsService.get('resourceId');

    return {
      ...baseArgs,
      resource: resource ? i18nService.translate(`resources.${resource}`, {
        lang: request.i18nLang,
      }) : undefined,
      id
    };
  }
}