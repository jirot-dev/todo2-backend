import { ConsoleLogger, Injectable, Logger, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

import { AVAILABLE_TRANSPORTS, LogTransportType } from '../types/app-logger.types';
import { LogMetadata, TransportStatus } from '../interfaces/log.interface';
import { TransportFactory } from '../transports/transport.factory';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private winstonLogger: winston.Logger;
  private transports: Map<LogTransportType, winston.transport> = new Map();
  private runningTransports: Set<LogTransportType> = new Set();
  private context?: string;

  constructor(
    private configService: ConfigService
  ) {
    this.initializeLogger();
  }

  setContext(context: string) {
    this.context = context;
  }

  private initializeLogger(): void {
    const logConfig = this.configService.get('log');
    const transportFactory = new TransportFactory(this.configService);

    // Initialize enabled transports
    const activeTransports: winston.transport[] = [];

    AVAILABLE_TRANSPORTS.forEach(type => {
      const transport = transportFactory.createTransport(type);
      if (transport) {
        this.transports.set(type, transport);
        // Check if transport should start automatically
        if (logConfig[type].start !== false) {
          activeTransports.push(transport);
          this.runningTransports.add(type);
        }
      }
    });

    this.winstonLogger = winston.createLogger({
      level: logConfig.level || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: activeTransports,
    });
  }

  log(message: any, context?: string, metadata?: LogMetadata): void {
    this.winstonLogger.info(message, {
      context: context || this.context,
      ...metadata
    });
  }

  error(message: any, trace?: string, context?: string, metadata?: LogMetadata): void {
    this.winstonLogger.error(message, {
      trace,
      context: context || this.context,
      ...metadata
    });
  }

  warn(message: any, context?: string, metadata?: LogMetadata): void {
    this.winstonLogger.warn(message, {
      context: context || this.context,
      ...metadata
    });
  }

  debug(message: any, context?: string, metadata?: LogMetadata): void {
    this.winstonLogger.debug(message, {
      context: context || this.context,
      ...metadata
    });
  }

  verbose(message: any, context?: string, metadata?: LogMetadata): void {
    this.winstonLogger.verbose(message, {
      context: context || this.context,
      ...metadata
    });
  }

  setLogLevel(level: string): void {
    this.transports.forEach(transport => {
      transport.level = level;
    });
  }

  getLogLevel(): string {
    return this.winstonLogger.level;
  }

  getTransportStatus(type: LogTransportType): TransportStatus | null {
    const transport = this.transports.get(type);
    if (!transport) return null;

    return {
      enabled: true, // If it's in transports Map, it's enabled
      active: this.runningTransports.has(type),
      level: transport.level || this.winstonLogger.level,
      type
    };
  }

  startTransport(type: LogTransportType): void {
    const transport = this.transports.get(type);
    if (transport && !this.runningTransports.has(type)) {
      this.winstonLogger.add(transport);
      this.runningTransports.add(type);
    }
  }

  stopTransport(type: LogTransportType): void {
    const transport = this.transports.get(type);
    if (transport && this.runningTransports.has(type)) {
      this.winstonLogger.remove(transport);
      this.runningTransports.delete(type);
    }
  }

  getAllTransportStatus(): TransportStatus[] {
    return Array.from(this.transports.keys())
      .map(type => this.getTransportStatus(type))
      .filter((status): status is TransportStatus => status !== null);
  }
}