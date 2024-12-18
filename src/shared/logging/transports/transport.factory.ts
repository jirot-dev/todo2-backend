import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';

import { PostgresTransport } from './postgres.transport';
import { LogTransportType } from '../types/app-logger.types';
import { ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig, LogConfig } from 'src/shared/config/interfaces/config.interface';

/*
import * as WinstonLogstash from 'winston-logstash-transport';
import { FluentTransport } from 'winston-fluent-transport';
*/

export class TransportFactory {
  private appConfig: AppConfig;
  private logConfig: LogConfig;
  private env: string;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.appConfig = this.configService.get('app');
    this.logConfig = this.configService.get('log');
    this.env = this.appConfig.env;
  }

  createTransport(transportType: LogTransportType): winston.transport | null {
    const creators: Record<LogTransportType, () => winston.transport | null> = {
      console: () => this.createConsoleTransport(),
      file: () => this.createFileTransport(),
      database: () => this.createDatabaseTransport(),
      loki: () => this.createLokiTransport(),
      fluentd: () => this.createFluentdTransport(),
      logstash: () => this.createLogstashTransport(),
    };

    const creator = creators[transportType];
    return creator ? creator() : null;
  }

  private createConsoleTransport(): winston.transport {
    if (!this.logConfig.console.enabled) return null;

    const developmentFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('MyApp', {
        prettyPrint: true,
        colors: true,
      })
    );

    const productionFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    return new winston.transports.Console({
      format: this.env === 'development' ? developmentFormat : productionFormat,
    });
  }

  private createFileTransport(): winston.transport | null {
    if (!this.logConfig.file.enabled) return null;

    return new DailyRotateFile({
      filename: this.logConfig.file.fileName,
      datePattern: this.logConfig.file.datePattern,
      maxSize: this.logConfig.file.maxSize,
      maxFiles: this.logConfig.file.maxFiles,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    });
  }

  private createDatabaseTransport(): winston.transport | null {
    if (!this.logConfig.database.enabled) return null;

    const databaseConfig: DatabaseConfig = this.configService.get('database');
    return new PostgresTransport(this.logConfig, databaseConfig);
  }

  private createLokiTransport(): winston.transport | null {
    if (!this.logConfig.loki.enabled) return null;

    return new LokiTransport({
      host: this.logConfig.loki.host,
      labels: { app: this.appConfig.name },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki connection error:', err),
    });

  }

  private createFluentdTransport(): winston.transport | null {
    if (!this.logConfig.fluentd.enabled) return null;

    return null;
    /*
    return new FluentTransport({
      tag: this.appConfig.name,
      options: {
        host: this.logConfig.fluentd.host,
        port: this.logConfig.fluentd.port,
        timeout: this.logConfig.fluentd.timeout,
        requireAckResponse: true,
      },
    });
    */
  }

  private createLogstashTransport(): winston.transport | null {
    if (!this.logConfig.logstash.enabled) return null;

    return null;
    /*
    return new WinstonLogstash({
      host: this.logConfig.logstash.host,
      port: this.logConfig.logstash.port,
      applicationName: this.appConfig.name,
      protocol: 'tcp',
      ssl_enable: this.logConfig.logstash.ssl,
      max_connect_retries: this.logConfig.logstash.retries,
      timeout_connect_retries: this.logConfig.logstash.timeout,
    });
    */
  }
}