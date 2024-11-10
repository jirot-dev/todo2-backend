import { LogTransportType } from '../types/app-logger.types';


export interface TransportStatus {
    enabled: boolean;
    active: boolean;
    level: string;
    type: LogTransportType;
}