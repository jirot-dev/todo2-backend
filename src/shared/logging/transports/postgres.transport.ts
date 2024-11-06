import { Injectable } from '@nestjs/common';
import * as Transport from 'winston-transport';
import { Pool, PoolConfig } from 'pg';

import { DatabaseConfig, LogConfig } from 'src/shared/core/interfaces/config.interface';

@Injectable()
export class PostgresTransport extends Transport {
  private readonly pool: Pool;
  private readonly tableName: string;
  private readonly schema: string;
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private batch: LogData[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor(logConfig: LogConfig, databaseConfig: DatabaseConfig) {
    super();
    
    // Create pool config from ConfigService
    const poolConfig: PoolConfig = {
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      user: databaseConfig.username,
      password: databaseConfig.password,
      // Additional pool settings
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(poolConfig);
    this.tableName = logConfig.database.tableName;
    this.schema = logConfig.database.schema;
    this.batchSize = logConfig.database.batchSize;
    this.flushInterval = logConfig.database.flushInterval;

    this.initializeTable().catch(err => {
      console.error('Failed to initialize logging table:', err);
    });

    this.startFlushTimer();
  }

  private async initializeTable(): Promise<void> {
    if (this.isInitialized) return;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${this.schema}.${this.tableName} (
        id BIGSERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL,
        level VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        context VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_${this.tableName}_timestamp 
        ON ${this.schema}.${this.tableName} (timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_${this.tableName}_level 
        ON ${this.schema}.${this.tableName} (level);
    `;

    try {
      await this.pool.query(createTableQuery);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error creating logs table:', error);
      throw error;
    }
  }

  private startFlushTimer(): void {
    this.timer = setInterval(() => {
      if (this.batch.length > 0) {
        this.flush().catch(err => {
          console.error('Failed to flush logs:', err);
        });
      }
    }, this.flushInterval);
  }

  async log(info: LogData, callback: () => void): Promise<void> {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.batch.push({
      level: info.level,
      message: info.message,
      timestamp: new Date(),
      context: info.context,
      metadata: info.metadata,
    });

    if (this.batch.length >= this.batchSize) {
      try {
        await this.flush();
      } catch (error) {
        console.error('Failed to flush logs:', error);
      }
    }

    callback();
  }

  private async flush(): Promise<void> {
    if (this.batch.length === 0 || !this.isInitialized) return;

    const logsToInsert = [...this.batch];
    this.batch = [];

    try {
      const values = logsToInsert.map((_, i) => {
        const offset = i * 5;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
      }).join(',');

      const flatParams = logsToInsert.flatMap(log => [
        log.timestamp,
        log.level,
        log.message,
        log.context || null,
        log.metadata ? JSON.stringify(log.metadata) : null
      ]);

      const query = `
        INSERT INTO ${this.schema}.${this.tableName} 
        (timestamp, level, message, context, metadata)
        VALUES ${values}
      `;

      await this.pool.query(query, flatParams);
    } catch (error) {
      // In case of error, put the logs back in the batch to retry
      this.batch = [...logsToInsert, ...this.batch];
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Flush any remaining logs
    if (this.batch.length > 0) {
      try {
        await this.flush();
      } catch (error) {
        console.error('Failed to flush logs during shutdown:', error);
      }
    }

    await this.pool.end();
  }
}