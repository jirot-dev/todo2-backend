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
  
  export interface AppConfig {
    port: number;
    cors: {
      origin: string[];
    };
  }
  
  export interface I18nConfig {
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
      filename: string;
      datePattern: string;
      maxSize: string;
      maxFiles: string;
    };
    db: {
      enabled: boolean;
    };
    logstash: {
      enabled: boolean;
      host: string;
      port: number;
      applicationName: string;
    };
    loki: {
      enabled: boolean;
      host: string;
      labels: {
        app: string;
        environment: string;
      };
    };
    fluentd: {
      enabled: boolean;
      host: string;
      port: number;
      tag: string;
      timeout: number;
    };
  }

  export interface Config {
    database: DatabaseConfig;
    app: AppConfig;
    i18n: I18nConfig;
    log: LogConfig;
  }