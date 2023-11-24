import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification } from './entities/notification.entity'
import { User } from 'src/user/entities/user.entity'
import { EventsGateway } from 'src/events/events.gateway'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), JwtModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EventsGateway],
  exports: [NotificationsService, TypeOrmModule],
})
export class NotificationsModule {}
