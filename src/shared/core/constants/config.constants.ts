import { registerAs } from '@nestjs/config';

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

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT, 10),
  cors: {
    origin: (process.env.APP_CORS_ORIGINS || '*').split(','),
  }
}));

export const i18nConfig = registerAs('i18n', () => ({
  defaultLocale: 'en',
  locales: ['en', 'th'],
}));

export const logConfig = registerAs('log', () => ({
  level: process.env.LOG_LEVEL,
  console: {
    enabled: process.env.LOGGER_CONSOLE_ENABLED === 'true',
  },
  file: {
    enabled: process.env.LOGGER_FILE_ENABLED === 'true',
    filename: process.env.LOGGER_FILE_FILENAME || 'logs/app-%DATE%.log',
    datePattern: process.env.LOGGER_FILE_DATE_PATTERN || 'YYYY-MM-DD',
    maxSize: process.env.LOGGER_FILE_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGER_FILE_MAX_FILES || '7d',
  },
  db: {
    enabled: process.env.LOGGER_DB_ENABLED === 'true',
  },
  logstash: {
    enabled: process.env.LOGGER_LOGSTASH_ENABLED === 'true',
    host: process.env.LOGGER_LOGSTASH_HOST || 'localhost',
    port: parseInt(process.env.LOGGER_LOGSTASH_PORT || '5000', 10),
    applicationName: process.env.LOGGER_LOGSTASH_APP_NAME || 'myapp',
  },
  loki: {
    enabled: process.env.LOGGER_LOKI_ENABLED === 'true',
    host: process.env.LOGGER_LOKI_HOST || 'http://localhost:3100',
    labels: {
      app: process.env.LOGGER_LOKI_APP_LABEL || 'myapp',
      environment: process.env.NODE_ENV || 'development',
    },
  },
  fluentd: {
    enabled: process.env.LOGGER_FLUENTD_ENABLED === 'true',
    host: process.env.LOGGER_FLUENTD_HOST || 'localhost',
    port: parseInt(process.env.LOGGER_FLUENTD_PORT || '24224', 10),
    tag: process.env.LOGGER_FLUENTD_TAG || 'myapp',
    timeout: parseFloat(process.env.LOGGER_FLUENTD_TIMEOUT || '3.0'),
  },
}));

export const openTelemetryConfig = registerAs('otlp', () => ({
  enabled: process.env.OTLP_ENABLED === 'true',
  endpoint: process.env.OTLP_ENDPOINT,
  serviceName: process.env.OTLP_SERVICE_NAME || 'app',
  serviceVersion: process.env.OTLP_SERVICE_VERSION || '1' 
}));