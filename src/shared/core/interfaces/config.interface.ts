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
    };
    file: {
        enabled: boolean;
        fileName: string;
        datePattern: string;
        maxSize: string;
        maxFiles: string;
    };
    db: {
        enabled: boolean;
        tableName: string;
        schema: string;
        batchSize: number;
        flushInterval: number;
    };
    logstash: {
        enabled: boolean;
        host: string;
        port: number;
        ssl: boolean;
        retries: number;
        timeout: number;
    };
    loki: {
        enabled: boolean;
        host: string;
    };
    fluentd: {
        enabled: boolean;
        host: string;
        port: number;
        timeout: number;
    };
}

export interface Config {
    app: AppConfig;
    helath: HealthConfig;
    database: DatabaseConfig;
    locale: LocaleConfig;
    log: LogConfig;
}