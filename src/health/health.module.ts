import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
