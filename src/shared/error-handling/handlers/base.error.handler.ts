import { HttpException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorDto, ErrorDtoBuilder, SubErrorDto, ValidationErrorDto } from '../../core/dtos/error.dto';
import { ErrorMessages, ErrorStatus } from '../constants/error-constant';
import { BaseError } from '../exceptions/base.error';
import { ValidationError } from '../exceptions/validation.error';
import { NotFoundError } from '../exceptions/not-found.error';

export interface MessageArgsHandler {
  getMessageArgs(error: Error, request: Request, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any>;
}

export interface ErrorHandler {
  canHandle(error: unknown): boolean;
  handle(error: unknown, request: Request, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto;
}

class DefaultMessageArgsHandler implements MessageArgsHandler {
  getMessageArgs(error: Error, request: Request, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any> {
    return baseArgs;
  }
}

export abstract class AbstractErrorHandler<T extends Error> implements ErrorHandler {
  protected messageArgsHandlers: MessageArgsHandler[];

  protected constructor(
    private readonly errorType: new (...args: any[]) => T,
    protected readonly defaultStatus: number,
    protected readonly defaultMessageKey: string
  ) {
    this.messageArgsHandlers = [
      new DefaultMessageArgsHandler()
    ];
  }

  canHandle(error: unknown): boolean {
    return error instanceof this.errorType;
  }

  handle(error: unknown, request: Request, i18nService: I18nService, cls: ClsService<ClsStore>): ErrorDto {
    const typedError = error as T;
    const builder = new ErrorDtoBuilder(request.url)
      .setStatusCode(this.getStatus(typedError))
      .setMessageKey(this.getMessageKey(typedError))
      .setMessage(this.getMessage(typedError, request, i18nService));

    this.customizeBuilder(builder, typedError, request, i18nService, cls);
    
    if (typedError instanceof BaseError && typedError.hasSubErrors()) {
      this.handleSubErrors(builder, typedError, request, i18nService);
    }
    
    return builder.build();
  }

  protected getStatus(error: T): number {
    if ((error instanceof BaseError || error instanceof HttpException) && error.getStatus() !== undefined) {
      return error.getStatus()!;
    }
    return this.defaultStatus;
  }

  protected getMessage(error: T, request: any, i18nService: I18nService): string {
    const messageKey = this.getMessageKey(error);
    const messageArgs = this.getMessageArgs(error, request, i18nService);
    
    return i18nService.translate(messageKey, {
      lang: request.i18nLang,
      args: messageArgs,
    });
  }

  protected getMessageKey(error: T): string {
    return error instanceof BaseError ? error.getMessageKey() : this.defaultMessageKey;
  }

  protected getMessageArgs(error: T, request: Request, i18nService: I18nService): Record<string, any> | undefined {
    if (!(error instanceof BaseError)) {
      return undefined;
    }

    const baseArgs = error.getMessageArgs() || {};
    
    return this.messageArgsHandlers.reduce(
      (args, handler) => handler.getMessageArgs(error, request, i18nService, args),
      baseArgs
    );
  }

  protected customizeBuilder(
    builder: ErrorDtoBuilder,
    error: T,
    request: Request,
    i18nService: I18nService,
    cls: ClsService<ClsStore>
  ): void {}

  protected handleSubErrors(
    builder: ErrorDtoBuilder,
    error: BaseError,
    request: any,
    i18nService: I18nService
  ): void {
    const subErrors = error.getSubErrors().map(err => {
      const messageArgs = this.getMessageArgs(err as unknown as T, request, i18nService);
      
      const subError: SubErrorDto = {
        messageKey: err.getMessageKey(),
        message: i18nService.translate(err.getMessageKey(), {
          lang: request.i18nLang,
          args: messageArgs,
        })
      };

      if (err instanceof ValidationError && err.getFieldName()) {
        (subError as ValidationErrorDto).fieldName = err.getFieldName();
      }

      return subError;
    });

    builder.addSubErrors(subErrors);
  }
}


export class BaseErrorHandler extends AbstractErrorHandler<BaseError> {
  constructor() {
    super(BaseError, ErrorStatus.BAD_REQUEST, ErrorMessages.INTERNAL);
  }
}