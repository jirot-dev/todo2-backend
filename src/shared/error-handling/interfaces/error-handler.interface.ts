import { ClsService, ClsStore } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { ErrorResponseDto } from "src/shared/core/dtos/error-response.dto";

export interface ErrorHandler {
    canHandle(error: unknown): boolean;
    handle(error: unknown, request: Request, i18nService: I18nService, clsService: ClsService<ClsStore>): ErrorResponseDto;
}