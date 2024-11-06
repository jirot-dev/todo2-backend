import * as Transport from 'winston-transport';
import { LogRepository } from '../repositories/log.repository';
import { LogEntity } from '../entities/log.entity';

export class PostgresTransport extends Transport {
  private readonly repository: LogRepository;

  constructor(opts: any) {
    super(opts);
    this.repository = opts.repository;
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      await this.repository.insert({
        level: info.level,
        message: info.message,
        timestamp: new Date(),
        context: info.context,
        metadata: info.metadata,
      } as LogEntity);
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }

    callback();
  }
}