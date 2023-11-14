import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseConfig } from './config/database.config'
import { CompanyModule } from './company/company.module'
import { RequestModule } from './requests/request.module'
import { InvitationModule } from './invitations/invitation.module'
import { QuizModule } from './quizzes/quiz.module'
import { QuestionModule } from './questions/question.module'
import { QuizAttemptModule } from './quiz_attempts/quiz_attempt.module'
import { RedisModule } from './redis/redis.module'
import { ExportModule } from './export/export.module'
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    HealthModule,
    UserModule,
    AuthModule,
    CompanyModule,
    RequestModule,
    InvitationModule,
    QuizModule,
    QuestionModule,
    QuizAttemptModule,
    RedisModule,
    ExportModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
