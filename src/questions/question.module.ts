import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { Invitation } from 'src/invitations/entities/invitation.entity'
import { Question } from 'src/questions/entities/question.entity'
import { User } from 'src/user/entities/user.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { Request } from 'src/requests/entities/request.entity'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { Notification } from 'src/notifications/entities/notification.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { EventsGateway } from 'src/events/events.gateway'
import { JwtModule } from '@nestjs/jwt'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Auth,
      Company,
      Request,
      Invitation,
      Quiz,
      Question,
      Notification,
    ]),
    JwtModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, NotificationsService, EventsGateway],
  exports: [QuestionService],
})
export class QuestionModule {}
