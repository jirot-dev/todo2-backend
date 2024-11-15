import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import short from 'short-uuid';

import { BadRequestError } from '../exceptions/bad-request.error';
import { ApplicationError } from '../exceptions/application.error';
import { ErrorMessages } from '../constants/error.constant';

export const ToUUID = createParamDecorator(
  (parameterName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const paramValue = request.params[parameterName];

    if (!paramValue) {
      const error = new BadRequestError()
      error.appendSubError(new ApplicationError(ErrorMessages.PARAM_NOT_FOUND, { 'parameterName': parameterName }));
      throw error;
    }

    const translator = short();
    return translator.toUUID(paramValue);
  },
);