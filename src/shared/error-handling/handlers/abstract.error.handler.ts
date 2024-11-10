import { HttpException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ErrorResponseDto, ErrorDtoBuilder, SubErrorResponseDto, ValidationErrorResponseDto } from '../../core/dtos/error-response.dto';
import { ApplicationError } from '../exceptions/application.error';
import { ValidationError } from '../exceptions/validation.error';
import { MessageArgsHandler } from '../interfaces/message-args-handler.interface';
import { ErrorHandler } from '../interfaces/error-handler.interface';

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

  handle(error: unknown, request: Request, i18nService: I18nService, clsService: ClsService<ClsStore>): ErrorResponseDto {
    const typedError = error as T;
    const builder = new ErrorDtoBuilder(request.url)
      .setStatusCode(this.getStatus(typedError))
      .setMessageKey(this.getMessageKey(typedError))
      .setMessage(this.getMessage(typedError, request, i18nService));

    this.customizeErrorDtoBuilder(builder, typedError, request, i18nService, clsService);
    
    if (typedError instanceof ApplicationError && typedError.hasSubErrors()) {
      this.handleSubErrors(builder, typedError, request, i18nService);
    }
    
    return builder.build();
  }

  protected getStatus(error: T): number {
    if ((error instanceof ApplicationError || error instanceof HttpException) && error.getStatus() !== undefined) {
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
    return error instanceof ApplicationError ? error.getMessageKey() : this.defaultMessageKey;
  }

  protected getMessageArgs(error: T, request: Request, i18nService: I18nService): Record<string, any> | undefined {
    if (!(error instanceof ApplicationError)) {
      return undefined;
    }

    const baseArgs = error.getMessageArgs() || {};
    
    return this.messageArgsHandlers.reduce(
      (args, handler) => handler.getMessageArgs(error, request, i18nService, args),
      baseArgs
    );
  }

  protected customizeErrorDtoBuilder(
    builder: ErrorDtoBuilder,
    error: T,
    request: Request,
    i18nService: I18nService,
    clsService: ClsService<ClsStore>
  ): void {}

  protected handleSubErrors(
    builder: ErrorDtoBuilder,
    error: ApplicationError,
    request: any,
    i18nService: I18nService
  ): void {
    const subErrors = error.getSubErrors().map(subError => {
      const messageArgs = this.getMessageArgs(subError as unknown as T, request, i18nService);
      
      const subErrorResponseDto: SubErrorResponseDto = {
        messageKey: subError.getMessageKey(),
        message: i18nService.translate(subError.getMessageKey(), {
          lang: request.i18nLang,
          args: messageArgs,
        })
      };

      if (subError instanceof ValidationError && subError.getFieldName()) {
        (subErrorResponseDto as ValidationErrorResponseDto).fieldName = subError.getFieldName();
      }

      return subErrorResponseDto;
    });

    builder.addSubErrors(subErrors);
  }
}


