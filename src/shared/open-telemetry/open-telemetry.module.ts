import { DynamicModule, Global, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtelTraceProvider } from './open-telemetry.provider';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OtelConfig } from 'src/shared/config/interfaces/config.interface';

@Global()
@Module({})
export class OtelModule implements OnApplicationBootstrap, OnApplicationShutdown {
    private static sdk: NodeSDK;
    private static isTracingStarted = false;

    constructor(private readonly configService: ConfigService) {}

    static forRoot(): DynamicModule {
        return {
            module: OtelModule,
            providers: [OtelTraceProvider],
            exports: [OtelTraceProvider],
            global: true
        };
    }

    async onApplicationBootstrap() {
        const config = this.configService.get<OtelConfig>('otel');
        if (!config?.enabled) {
            return;
        }

        const provider = new OtelTraceProvider(this.configService);
        OtelModule.sdk = provider.createNodeSDK();

        if (config.tracingStart) {
            await OtelModule.startTracing();
        }
    }

    async onApplicationShutdown() {
        if (OtelModule.sdk && OtelModule.isTracingStarted) {
            await OtelModule.stopTracing();
        }
    }

    static async startTracing() {
        if (!OtelModule.sdk || OtelModule.isTracingStarted) {
            return;
        }

        console.log('before start otel sdk');
        await OtelModule.sdk.start();
        console.log('after start otel sdk');
        
        OtelModule.isTracingStarted = true;
    }

    static async stopTracing() {
        if (!OtelModule.sdk || !OtelModule.isTracingStarted) {
            return;
        }

        await OtelModule.sdk.shutdown();
        OtelModule.isTracingStarted = false;
    }
}