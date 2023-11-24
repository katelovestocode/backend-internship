import { Module } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { User } from 'src/user/entities/user.entity'
import { Company } from './entities/company.entity'
import { UserService } from 'src/user/user.service'
import { NotificationsService } from 'src/notifications/notifications.service'
import { Notification } from 'src/notifications/entities/notification.entity'
import { EventsGateway } from 'src/events/events.gateway'
import { JwtModule } from '@nestjs/jwt'
@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User, Company, Notification]),
    JwtModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, UserService, NotificationsService, EventsGateway],
  exports: [CompanyService],
})
export class CompanyModule {}
