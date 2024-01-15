import { Module } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { Question } from 'src/questions/entities/question.entity'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { RedisModule } from 'src/redis/redis.module'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Auth,
      Company,
      Quiz,
      Question,
      QuizAttempt,
      RedisModule,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
