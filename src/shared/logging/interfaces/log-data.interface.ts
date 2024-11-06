interface LogData {
    level: string;
    message: string;
    timestamp: Date;
    context?: string;
    metadata?: Record<string, any>;
}