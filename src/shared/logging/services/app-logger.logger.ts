import { ConsoleLogger, Injectable, Logger, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

import { AVAILABLE_TRANSPORTS, LogTransportType } from '../types/app-logger.types';
import { LogMetadata, TransportStatus } from '../interfaces/log.interface';
import { TransportFactory } from '../transports/transport.factory';
import { LogRepository } from '../repositories/log.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private winstonLogger: winston.Logger;
  private transports: Map<LogTransportType, winston.transport> = new Map();
  private transportEnabled: Map<LogTransportType, boolean> = new Map();
  private transportActive: Map<LogTransportType, boolean> = new Map();
  private context?: string;

  constructor(
    private configService: ConfigService,
    private logRepository: LogRepository
  ) {
    this.initializeLogger();
  }

  setContext(context: string) {
    this.context = context;
  }

  private initializeLogger(): void {
    const logConfig = this.configService.get('log');
    const env = this.configService.get('NODE_ENV');
    
    const transportFactory = new TransportFactory(
      logConfig,
      env,
      this.logRepository
    );

    AVAILABLE_TRANSPORTS.forEach(type => {
      this.transportEnabled.set(type, false);
      this.transportActive.set(type, false);
    });

    const transports = AVAILABLE_TRANSPORTS
      .map(type => {
        const transport = transportFactory.createTransport(type);
        if (transport) {
          this.transports.set(type, transport);
          this.transportEnabled.set(type, true);
          this.transportActive.set(type, true);
        }
        return transport;
      })
      .filter((transport): transport is winston.transport => transport !== null);

    this.winstonLogger = winston.createLogger({
      level: logConfig.level || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports,
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
  
  getTransportStatus(type: LogTransportType): TransportStatus {
    const transport = this.transports.get(type);
    const enabled = this.transportEnabled.get(type) || false;
    const active = this.transportActive.get(type) || false;

    return {
      enabled,
      active,
      level: transport?.level || this.winstonLogger.level,
      type
    };
  }

  enableTransport(type: LogTransportType): void {
    const transport = this.transports.get(type);
    if (transport && this.transportEnabled.get(type)) {
      this.winstonLogger.add(transport);
      this.transportActive.set(type, true);
    }
  }

  disableTransport(type: LogTransportType): void {
    const transport = this.transports.get(type);
    if (transport) {
      this.winstonLogger.remove(transport);
      this.transportActive.set(type, false);
    }
  }
}