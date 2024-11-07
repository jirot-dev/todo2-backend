import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OtelConfig } from 'src/shared/config/interfaces/config.interface';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

@Injectable()
export class OtelTraceProvider {
    constructor(private readonly configService: ConfigService) {}

    createNodeSDK(): NodeSDK {
        const config: OtelConfig = this.configService.get('otel');
        
        const traceExporter = new OTLPTraceExporter ({
            url: config.endpoint,
            headers: {
                [config.authHeader]: config.authKey
            }, 
            
        });

        const resource = new Resource({
            [ATTR_SERVICE_NAME]: this.configService.get('app.name'),
            [ATTR_SERVICE_VERSION]: this.configService.get('app.version'),
        });

        return new NodeSDK({
            instrumentations: [getNodeAutoInstrumentations()],
            resource,
            spanProcessor: new SimpleSpanProcessor(traceExporter)
        });
    }
}
