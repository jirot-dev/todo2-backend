import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter({
    //url: 'http://localhost:4318/v1/traces',
    url: 'https://ingest.us.signoz.cloud/v1/traces',
    headers: {['signoz-access-token']: 'a58d0bc7-97d5-4e1d-a0aa-fdee13e6d048'},
});
  
  // Setup OpenTelemetry
export const otelSDK = new opentelemetry.NodeSDK({
    traceExporter,
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'myapp5',
    }),
    instrumentations: [getNodeAutoInstrumentations()]
});
  
//sdk.start();
  
process.on('SIGTERM', () => {
    otelSDK
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
});