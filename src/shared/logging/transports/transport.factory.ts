import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { PostgresTransport } from './postgres.transport';
import { LogEntity } from '../entities/log.entity';
import { LogTransportType } from '../types/app-logger.types';
import { LogRepository } from '../repositories/log.repository';
/*
import * as WinstonLoki from 'winston-loki';
import * as WinstonLogstash from 'winston-logstash-transport';
import { FluentTransport } from 'winston-fluent-transport';
*/

export class TransportFactory {
  constructor(
    private readonly logConfig: any,
    private readonly env: string,
    private readonly logRepository?: LogRepository
  ) {}

  createTransport(type: LogTransportType): winston.transport | null {
    const creators: Record<LogTransportType, () => winston.transport | null> = {
      console: () => this.createConsoleTransport(),
      file: () => this.createFileTransport(),
      database: () => this.createDatabaseTransport(),
      loki: () => this.createLokiTransport(),
      fluentd: () => this.createFluentdTransport(),
      logstash: () => this.createLogstashTransport(),
    };

    const creator = creators[type];
    return creator ? creator() : null;
  }

  private createConsoleTransport(): winston.transport {
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
      filename: this.logConfig.file.filename,
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
    if (!this.logConfig.db.enabled || !this.logRepository) return null;

    return new PostgresTransport(this.logRepository);
  }

  private createLokiTransport(): winston.transport | null {
    if (!this.logConfig.loki.enabled) return null;

    return null;
    /*
    return new WinstonLoki({
      host: this.logConfig.loki.host,
      labels: { app: this.logConfig.loki.labels.app },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki connection error:', err),
    });
    */
  }

  private createFluentdTransport(): winston.transport | null {
    if (!this.logConfig.fluentd.enabled) return null;

    return null;
    /*
    return new FluentTransport({
      tag: this.logConfig.fluentd.tag,
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
      applicationName: this.logConfig.logstash.applicationName,
      protocol: 'tcp',
      ssl_enable: this.logConfig.logstash.ssl || false,
      max_connect_retries: -1,
      timeout_connect_retries: 1000,
    });
    */
  }
}