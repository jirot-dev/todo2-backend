import { LogTransportType } from '../types/app-logger.types';

export interface LogMetadata {
    context?: string;
    trace?: string;
    [key: string]: any;
}

export interface TransportStatus {
    enabled: boolean;
    active: boolean;
    level: string;
    type: LogTransportType;
}