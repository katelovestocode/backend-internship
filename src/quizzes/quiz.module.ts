import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/company/entities/company.entity'
import { Question } from 'src/questions/entities/question.entity'
import { User } from 'src/user/entities/user.entity'
import { Quiz } from './entities/quiz.entity'
import { QuizService } from './quiz.service'
import { QuizController } from './quiz.controller'
import { QuestionService } from 'src/questions/question.service'
import { NotificationsService } from 'src/notifications/notifications.service'
import { Notification } from 'src/notifications/entities/notification.entity'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { QuizAttemptService } from 'src/quiz_attempts/quiz_attempt.service'
import { RedisService } from 'src/redis/redis.service'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { CompanyModule } from 'src/company/company.module'
import { QuestionModule } from 'src/questions/question.module'
import { EventsModule } from 'src/events/events.module'
import { EventsGateway } from 'src/events/events.gateway'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      Quiz,
      Question,
      QuizAttempt,
      Notification,
    ]),
    CompanyModule,
    NotificationsModule,
    QuestionModule,
    EventsModule,
    forwardRef(() => NotificationsModule),
    JwtModule,
  ],
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizAttemptService,
    NotificationsService,
    CompanyService,
    UserService,
    QuestionService,
    RedisService,
    EventsGateway,
  ],
  exports: [QuizService],
})
export class QuizModule {}
