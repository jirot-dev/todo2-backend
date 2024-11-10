import { I18nService } from "nestjs-i18n";

export interface MessageArgsHandler {
    getMessageArgs(error: Error, request: Request, i18nService: I18nService, baseArgs: Record<string, any>): Record<string, any>;
}