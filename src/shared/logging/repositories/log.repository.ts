import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from '../entities/log.entity';

@Injectable()
export class LogRepository {
    constructor(
        @InjectRepository(LogEntity)
        private readonly repository: Repository<LogEntity>
    ) {
    }

    async insert(entity: LogEntity): Promise<void> {
        await this.repository.save(entity);
    }
}