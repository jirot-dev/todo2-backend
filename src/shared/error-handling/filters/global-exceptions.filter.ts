import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ClsService, ClsStore } from 'nestjs-cls';
import { I18nService } from 'nestjs-i18n';
import { ErrorHandler } from '../interfaces/error-handler.interface';
import { ApplicationErrorHandler } from '../handlers/application.error.handler';
import { HttpExceptionHandler } from '../handlers/http.exception.handler';
import { DefaultErrorHandler } from '../handlers/fallback.error.handler';
import { TypeORMErrorHandler } from '../handlers/typeorm.error.handler';
import { NotFoundErrorHandler } from '../handlers/not-found.error.handler';
import { ValidationErrorHandler } from '../handlers/validation.error.handler';


@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);
  private readonly errorHandlers: ErrorHandler[];

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly clsService: ClsService<ClsStore>,
    private readonly i18nService: I18nService,
  ) {
    // Order matters - more specific handlers should come first
    this.errorHandlers = [
      new HttpExceptionHandler(),
      new TypeORMErrorHandler(),
      new NotFoundErrorHandler(this.clsService),
      new ValidationErrorHandler(),
      new ApplicationErrorHandler(),
      new DefaultErrorHandler(),
    ];
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    try {
      this.logger.error(exception);

      // Find the first handler that can handle this error
      const handler = this.errorHandlers.find(handler => handler.canHandle(exception));
      const errorResponse = handler.handle(exception, request, this.i18nService, this.clsService);

      // Add correlation ID if available
      if (request.correlationId) {
        errorResponse.correlationId = this.clsService.get('correlationId');
      }

      httpAdapter.reply(response, errorResponse, errorResponse.statusCode);
    } catch (filterError) {
      // If everything fails, send a basic error response
      httpAdapter.reply(
        response,
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          path: request.url
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}