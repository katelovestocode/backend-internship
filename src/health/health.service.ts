import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from './types/health.types';
@Injectable()
export class HealthService {
  async healthCheck(): Promise<HealthCheckResponse>{
    return await {
      status_code: 200,
      detail: 'ok',
      result: 'working',
    };
  }
}
