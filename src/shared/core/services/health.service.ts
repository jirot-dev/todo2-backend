import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  TypeOrmHealthIndicator, 
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { HealthConfig, DiskHealthConfig } from '../interfaces/config.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly config: HealthConfig;

  constructor(
    private typeOrm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get<HealthConfig>('health');
    this.validateConfig();
  }

  private validateConfig() {
    if (!this.config) {
      this.logger.warn('Health configuration not found');
      return;
    }

    // Validate disk paths
    this.config.disks.forEach(disk => {
      try {
        const normalizedPath = path.normalize(disk.path);
        const exists = fs.existsSync(normalizedPath);
        if (!exists) {
          this.logger.warn(`Disk path not found: ${normalizedPath} for disk: ${disk.name}`);
        } else {
          this.logger.log(`Validated disk path: ${normalizedPath} for disk: ${disk.name}`);
        }
      } catch (error) {
        this.logger.error(`Error validating disk path: ${disk.path} for disk: ${disk.name}`, error);
      }
    });

    this.logger.log(`Memory heap threshold: ${this.config.memoryHeap / 1024 / 1024}MB`);
    this.logger.log(`Memory RSS threshold: ${this.config.memoryRss / 1024 / 1024}MB`);
  }

  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      return await this.typeOrm.pingCheck('database', { 
        timeout: this.config.dbTimeout 
      });
    } catch (error) {
      this.logger.error(`Database check failed: ${error.message}`);
      return this.createErrorResponse('database', error.message);
    }
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    try {
      const heapCheck = await this.memory.checkHeap('memory_heap', this.config.memoryHeap);
      const rssCheck = await this.memory.checkRSS('memory_rss', this.config.memoryRss);
      return { ...heapCheck, ...rssCheck };
    } catch (error) {
      this.logger.error(`Memory check failed: ${error.message}`);
      return this.createErrorResponse('memory', error.message);
    }
  }

  async checkDisks(): Promise<HealthIndicatorResult> {
    try {
      const diskChecks = await Promise.all(
        this.config.disks.map(diskConfig => this.checkSingleDisk(diskConfig))
      );
      
      return diskChecks.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    } catch (error) {
      this.logger.error(`Disk checks failed: ${error.message}`);
      return this.createErrorResponse('disks', error.message);
    }
  }

  private async checkSingleDisk(diskConfig: DiskHealthConfig): Promise<HealthIndicatorResult> {
    const normalizedPath = path.normalize(diskConfig.path);
    
    try {
      // Check if path exists before attempting health check
      if (!fs.existsSync(normalizedPath)) {
        return this.createErrorResponse(
          diskConfig.name, 
          `Path not found: ${normalizedPath}`
        );
      }

      // Check if path is accessible
      try {
        await fs.promises.access(normalizedPath, fs.constants.R_OK);
      } catch {
        return this.createErrorResponse(
          diskConfig.name, 
          `Path not accessible: ${normalizedPath}`
        );
      }

      // Perform disk health check
      return await this.disk.checkStorage(diskConfig.name, {
        thresholdPercent: diskConfig.threshold,
        path: normalizedPath,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Disk check failed for ${normalizedPath}: ${errorMessage}`);
      
      return this.createErrorResponse(
        diskConfig.name, 
        `Check failed for ${normalizedPath}: ${errorMessage}`
      );
    }
  }

  private createErrorResponse(key: string, message: string): HealthIndicatorResult {
    this.logger.error(`Health check error - ${key}: ${message}`);
    return {
      [key]: {
        status: 'down',
        message,
      },
    };
  }
}