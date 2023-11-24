import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from 'src/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { Auth } from 'src/auth/entities/auth.entity'
import { UserValidGuard } from './guards/validation.guard'
import { Company } from 'src/company/entities/company.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { Notification } from 'src/notifications/entities/notification.entity'
import { EventsGateway } from 'src/events/events.gateway'
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Company, Notification]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    UserValidGuard,
    NotificationsService,
    EventsGateway,
  ],
  exports: [UserService],
})
export class UserModule {}
