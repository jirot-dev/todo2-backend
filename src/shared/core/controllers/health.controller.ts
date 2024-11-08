import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

import { HealthService } from '../services/health.service';


@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
  ) { }

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkMemory(),
      () => this.healthService.checkDisks(),
    ]);
  }

  @Get('ping')
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}