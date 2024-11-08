import { Module, Global, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';
import { OtelTraceProvider } from './otel-trace.provider';

@Global()
@Module({
  imports: [
    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        serviceName: configService.get('app.name'),
        metrics: {
          hostMetrics: true,
          apiMetrics: { enable: true,
            ignoreRoutes: ['/health'],
            ignoreUndefinedRoutes: false, 
          },
        },
      }),
    }),
  ],
  providers: [OtelTraceProvider],
  exports: [OtelTraceProvider],
})
export class OtelModule implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(private readonly otelTraceProvider: OtelTraceProvider) {}

  async onApplicationBootstrap() {
    await this.otelTraceProvider.start();
  }

  async onApplicationShutdown() {
    await this.otelTraceProvider.stop();
  }
}