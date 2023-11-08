import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { HealthService } from './health.service'
import { HealthCheckResponse } from './types/health.types'

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<HealthCheckResponse> {
    return await this.healthService.healthCheck()
  }
}
