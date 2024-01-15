import { Module } from '@nestjs/common'
import { ExportService } from './export.service'
import { ExportController } from './export.controller'
import { QuizService } from 'src/quizzes/quiz.service'
import { UserService } from 'src/user/user.service'
import { RedisService } from 'src/redis/redis.service'
import { Invitation } from 'src/invitations/entities/invitation.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { Company } from 'src/company/entities/company.entity'
import { Auth } from 'src/auth/entities/auth.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { RedisModule } from 'src/redis/redis.module'
import { Question } from 'src/questions/entities/question.entity'
import { QuestionService } from 'src/questions/question.service'
import { Request } from 'src/requests/entities/request.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { Notification } from 'src/notifications/entities/notification.entity'
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
      QuizAttempt,
      RedisModule,
      Notification,
    ]),
    JwtModule,
  ],
  controllers: [ExportController],
  providers: [
    ExportService,
    QuizService,
    UserService,
    RedisService,
    QuestionService,
    NotificationsService,
    EventsGateway,
  ],
})
export class ExportModule {}
