import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  healthCheck() {
    return {
      status_code: 200,
      detail: 'ok',
      result: 'working',
    };
  }
}
