import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
//import { OtelModule } from './open-telemetry/open-telemetry.module';
import { LoggingModule } from './logging/logging.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';

@Module({
    imports: [
      AppConfigModule,
      //OtelModule.forRoot(),
      CoreModule,
      LoggingModule,
      ErrorHandlingModule,
    ],
    exports: [
      AppConfigModule,
      //OtelModule,
      CoreModule,
      LoggingModule,
      ErrorHandlingModule
    ]
})
export class SharedModule {}