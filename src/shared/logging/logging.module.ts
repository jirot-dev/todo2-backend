import { Module } from '@nestjs/common';

import { AppLoggerService } from './services/app-logger.service';


@Module({
    imports: [],
    providers: [AppLoggerService],
    exports: []
})
export class LoggingModule { }