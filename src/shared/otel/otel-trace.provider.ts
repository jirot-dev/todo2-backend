import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { api, NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPExporterNodeConfigBase  } from '@opentelemetry/otlp-exporter-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { AppConfig, OtelConfig } from 'src/shared/config/interfaces/config.interface';


@Injectable()
export class OtelTraceProvider {
    private sdk: NodeSDK;
    private isStarted = false;

    constructor(private readonly configService: ConfigService) {
        this.initializeSdk();
    }

    private initializeSdk() {
        const appConfig: AppConfig = this.configService.get('app'); 
        const otelConfig: OtelConfig = this.configService.get('otel');

        if (!otelConfig.enabled) {
            return;
        }

        const traceExporterOptions = this.createExporterOption(otelConfig.tracesEndpoint, otelConfig.tracesHeaders);
        const traceExporter = new OTLPTraceExporter(traceExporterOptions);

        const resource = new Resource({
          [ATTR_SERVICE_NAME]: appConfig.name,
          [ATTR_SERVICE_VERSION]: appConfig.version,
          environment: appConfig.env
      });

        const metricExporterOptions = this.createExporterOption(otelConfig.metricsEndpoint, otelConfig.metricsHeaders);
        const metricExporter = new OTLPMetricExporter(metricExporterOptions);

        const metricReader = new PeriodicExportingMetricReader({
          exporter: metricExporter,
          exportIntervalMillis: otelConfig.metricsInterval,
        });

        const meterProvider = new MeterProvider({
          resource: resource,
          readers: [metricReader]
        });
      
        api.metrics.setGlobalMeterProvider(meterProvider);

        this.sdk = new NodeSDK({
            resource,
            traceExporter,
            instrumentations: [getNodeAutoInstrumentations()],
        });
    }

    async start() {
        if (!this.sdk || this.isStarted) {
          return;
        }
    
        try {
          await this.sdk.start();
          this.isStarted = true;
          console.log('OpenTelemetry initialized successfully');
        } catch (error) {
          console.error('Error starting OpenTelemetry:', error);
        }
    }
    
    async stop() {
        if (!this.sdk || !this.isStarted) {
          return;
        }
    
        try {
          await this.sdk.shutdown();
          this.isStarted = false;
          console.log('OpenTelemetry shut down successfully');
        } catch (error) {
          console.error('Error stopping OpenTelemetry:', error);
        }
    }
    
    isRunning() {
        return this.isStarted;
    }

    private createExporterOption(endpoint: string, headers: string): OTLPExporterNodeConfigBase {
      const exporterOptions: OTLPExporterNodeConfigBase  = {
        url: endpoint,
      };

      if (headers) {
        exporterOptions.headers = this.parseHeaders(headers);
      }

      return exporterOptions;
    }

    private parseHeaders(headersString: string): Record<string, string> {
        try {
          // Split the string by commas
          const headerEntries = headersString.split(',').map(entry => entry.trim());
          const headers: Record<string, string> = {};
      
          for (const entry of headerEntries) {
            // Find the index of first '=' sign
            const firstEqualIndex = entry.indexOf('=');
            
            if (firstEqualIndex !== -1) {
              const key = entry.substring(0, firstEqualIndex).trim();
              const value = entry.substring(firstEqualIndex + 1).trim();
              
              if (key && value) {
                headers[key] = value;
              }
            }
          }
      
          return headers;
        } catch (error) {
          console.error('Error parsing trace headers:', error);
          return {};
        }
    }
}
