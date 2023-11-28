import { Module } from '@nestjs/common'
import { CronJobService } from './cron-job.service'
import { QuizAttemptModule } from 'src/quiz_attempts/quiz_attempt.module'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { EventsModule } from 'src/events/events.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/company/entities/company.entity'
import { Question } from 'src/questions/entities/question.entity'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { RedisModule } from 'src/redis/redis.module'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [
    QuizAttemptModule,
    NotificationsModule,
    EventsModule,
    TypeOrmModule.forFeature([
      User,
      Company,
      Quiz,
      Question,
      QuizAttempt,
      RedisModule,
    ]),
  ],
  providers: [CronJobService],
})
export class CronJobModule {}
