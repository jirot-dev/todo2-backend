import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { LoggingModule } from './logging/logging.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';

@Module({
    imports: [
      CoreModule,
      LoggingModule,
      ErrorHandlingModule
    ],
    exports: [
      CoreModule,
      LoggingModule,
      ErrorHandlingModule
    ]
})
export class SharedModule {}