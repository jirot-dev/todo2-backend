import { Module } from '@nestjs/common';

import { AppLogger } from './services/app-logger.service';


@Module({
    imports: [],
    providers: [AppLogger],
    exports: []
})
export class LoggingModule { }