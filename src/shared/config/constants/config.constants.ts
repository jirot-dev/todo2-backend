import { registerAs } from '@nestjs/config';
import { DiskHealthConfig, HealthConfig } from '../interfaces/config.interface';


export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME || 'myapp',
  version: process.env.APP_VERSION || '1.0',
  port: parseInt(process.env.APP_PORT || '5000', 10),
  cors: {
    origin: (process.env.APP_CORS_ORIGINS || '*').split(','),
  },
  path: process.env.APP_PATH || 'api',
  docPath: process.env.APP_DOC_PATH || 'api/docs'
}));

export const healthConfig = registerAs('health', (): HealthConfig => {
  const parseDisksConfig = (disksJson: string): DiskHealthConfig[] => {
    try {
      const disks = JSON.parse(disksJson);
      if (!Array.isArray(disks)) {
        throw new Error('HEALTH_DISKS must be a JSON array');
      }

      return disks.map((disk, index) => {
        if (!disk.name || !disk.path || typeof disk.threshold !== 'number') {
          throw new Error(`Invalid disk configuration at index ${index}`);
        }
        return {
          name: disk.name,
          path: disk.path,
          threshold: disk.threshold
        };
      });
    } catch (error) {
      console.error('Error parsing HEALTH_DISKS:', error.message);
      return [];  // Return empty array as fallback
    }
  };

  return {
    memoryHeap: parseInt(process.env.HEALTH_MEMORY_HEAP || '250', 10) * 1024 * 1024,
    memoryRss: parseInt(process.env.HEALTH_MEMORY_RSS || '250', 10) * 1024 * 1024,
    dbTimeout: parseInt(process.env.HEALTH_DB_TIMEOUT || '3000', 10),
    disks: parseDisksConfig(process.env.HEALTH_DISKS || '[]'),
  };
});

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
}));

export const localeConfig = registerAs('locale', () => ({
  defaultLocale: process.env.LOCALE_DEFAULT || 'en',
  locales: (process.env.LOCALE_LIST || 'en').split(','),
}));

export const logConfig = registerAs('log', () => ({
  level: process.env.LOG_LEVEL,
  console: {
    enabled: (process.env.LOGGER_CONSOLE_ENABLED || 'true') === 'true',
    start: (process.env.LOGGER_CONSOLE_START || 'true') === 'true',
  },
  file: {
    enabled: (process.env.LOGGER_FILE_ENABLED || 'false') === 'true',
    start: (process.env.LOGGER_FILE_START || 'true') === 'true',
    fileName: process.env.LOGGER_FILE_FILENAME || 'logs/app-%DATE%.log',
    datePattern: process.env.LOGGER_FILE_DATE_PATTERN || 'YYYY-MM-DD',
    maxSize: process.env.LOGGER_FILE_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGER_FILE_MAX_FILES || '7d',
  },
  database: {
    enabled: (process.env.LOGGER_DB_ENABLED || 'false') === 'true',
    start: (process.env.LOGGER_DB_START || 'true') === 'true',
    tableName: process.env.LOGGER_DB_TABLE_NAME || 'logs',
    schema: process.env.LOGGER_DB_SCHEMA || 'public',
    batchSize: parseInt(process.env.LOGGER_DB_BATCH_SIZE || '100', 10),
    flushInterval: parseInt(process.env.LOGGER_DB_FLUSH_INTERVAL || '5000', 10)
  },
  logstash: {
    enabled: (process.env.LOGGER_LOGSTASH_ENABLED || 'false') === 'true',
    start: (process.env.LOGGER_LOGSTASH_START || 'true') === 'true',
    host: process.env.LOGGER_LOGSTASH_HOST || 'localhost',
    port: parseInt(process.env.LOGGER_LOGSTASH_PORT || '5000', 10),
    ssl: (process.env.LOGGER_LOGSTASH_SSL || 'true') === 'true',
    retries: parseInt(process.env.LOGGER_LOGSTASH_RETRIES || '-1', 10),
    timeout: parseInt(process.env.LOGGER_LOGSTASH_TIMEOUT || '1000', 10),
  },
  loki: {
    enabled: (process.env.LOGGER_LOKI_ENABLED || 'false') === 'true',
    start: (process.env.LOGGER_LOKI_START || 'true') === 'true',
    host: process.env.LOGGER_LOKI_HOST || 'http://localhost:3100'
  },
  fluentd: {
    enabled: (process.env.LOGGER_FLUENTD_ENABLED || 'false') === 'true',
    start: (process.env.LOGGER_FLUENTD_START || 'true') === 'true',
    host: process.env.LOGGER_FLUENTD_HOST || 'localhost',
    port: parseInt(process.env.LOGGER_FLUENTD_PORT || '24224', 10),
    timeout: parseFloat(process.env.LOGGER_FLUENTD_TIMEOUT || '3.0'),
  }
}));

export const otelConfig = registerAs('otel', () => ({
  enabled: process.env.OTEL_SDK_DISABLED === 'false',
  tracesStart: process.env.OTEL_EXPORTER_OTLP_TRACES_START === 'true',
  tracesEndpoint: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  tracesHeaders: process.env.OTEL_EXPORTER_OTLP_TRACES_HEADERS,
  metricsEndpoint: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  metricsHeaders: process.env.OTEL_EXPORTER_OTLP_METRICS_HEADERS,
  metricsInterval: parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || '60000', 10),
}));