import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/company/entities/company.entity'
import { Question } from 'src/questions/entities/question.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { QuizAttemptService } from './quiz_attempt.service'
import { QuizAttemptController } from './quiz_attempt.controller'
import { QuizAttempt } from './entities/quiz_attempt.entity'
import { QuizService } from 'src/quizzes/quiz.service'
import { QuestionService } from 'src/questions/question.service'
import { RedisModule } from 'src/redis/redis.module'
import { RedisService } from 'src/redis/redis.service'
import { Notification } from 'src/notifications/entities/notification.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
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
      RedisModule,
      Notification,
    ]),
    JwtModule,
  ],
  controllers: [QuizAttemptController],
  providers: [
    QuizAttemptService,
    QuizService,
    QuestionService,
    RedisService,
    NotificationsService,
    EventsGateway,
    JwtModule,
  ],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}
