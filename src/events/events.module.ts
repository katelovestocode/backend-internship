import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), JwtModule],
  providers: [EventsGateway, JwtModule],
  exports: [EventsGateway],
})
export class EventsModule {}
