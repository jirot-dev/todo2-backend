import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { AppLogger } from './services/app-logger.logger';
import { LogEntity } from './entities/log.entity';
import { LogRepository } from './repositories/log.repository';


@Module({
    imports: [
        TypeOrmModule.forFeature([LogEntity]),
    ],
    providers: [AppLogger, LogRepository],
    exports: []
})
export class LoggingModule {}