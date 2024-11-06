export interface AppConfig {
  env: string;
  name: string;
  version: string;
  port: number;
  cors: {
    origin: string[];
  };
  path: string;
  docPath: string;
}

export interface DiskHealthConfig {
    name: string;
    path: string;
    threshold: number;
}

export interface HealthConfig {
    memoryHeap: number;
    memoryRss: number;
    dbTimeout: number;
    disks: DiskHealthConfig[];
}

export interface DatabaseConfig {
    type: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
} 
  
export interface LocaleConfig {
    defaultLocale: string;
    locales: string[];
}
  
export interface LogConfig {
    level: string;
    console: {
        enabled: boolean;
        start: boolean;
    };
    file: {
        enabled: boolean;
        start: boolean;
        fileName: string;
        datePattern: string;
        maxSize: string;
        maxFiles: string;
    };
    database: {
        enabled: boolean;
        start: boolean;
        tableName: string;
        schema: string;
        batchSize: number;
        flushInterval: number;
    };
    logstash: {
        enabled: boolean;
        start: boolean;
        host: string;
        port: number;
        ssl: boolean;
        retries: number;
        timeout: number;
    };
    loki: {
        enabled: boolean;
        start: boolean;
        host: string;
    };
    fluentd: {
        enabled: boolean;
        start: boolean;
        host: string;
        port: number;
        timeout: number;
    };
}

export interface OtlpConfig {
    enabled: boolean;
    tracingStart: boolean;
    endpoint: boolean;
}

export interface Config {
    app: AppConfig;
    helath: HealthConfig;
    database: DatabaseConfig;
    locale: LocaleConfig;
    log: LogConfig;
    otlp: OtlpConfig;
}