import { CallHandler, ExecutionContext, Injectable, NestInterceptor, mixin, Type } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { AppClsStore } from '../interfaces/app-cls-store.interface';

export function ContextInterceptor(resource?: string): Type<NestInterceptor> {
    @Injectable()
    class MixinContextInterceptor implements NestInterceptor {
        constructor(public readonly cls: ClsService<AppClsStore>) {}

        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
            const request = context.switchToHttp().getRequest();
            const id = request.params.id;

            // Only set resource if it's provided
            if (resource) {
                this.cls.set('resource', resource);
            }
            
            this.cls.set('resourceId', id);
            this.cls.set('language', request.headers['accept-language']);
            
            if (request.user) {
                this.cls.set('userId', request.user.id);
            }

            return next.handle();
        }
    }

    const Interceptor = mixin(MixinContextInterceptor);
    return Interceptor;
}