import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import short from 'short-uuid';

export const ToUUID = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const paramValue = request.params[data];
    
    if (!paramValue) {
      throw new Error(`Parameter ${data} not found`);
    }

    const translator = short();
    return translator.toUUID(paramValue);
  },
);