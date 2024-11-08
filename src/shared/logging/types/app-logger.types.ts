export const AVAILABLE_TRANSPORTS = [
  'console',
  'file',
  'database',
  'loki',
  'fluentd',
  'logstash'
] as const;

export type LogTransportType = typeof AVAILABLE_TRANSPORTS[number];