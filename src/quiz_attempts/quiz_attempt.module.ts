import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { Invitation } from 'src/invitations/entities/invitation.entity'
import { Question } from 'src/questions/entities/question.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { Request } from 'src/requests/entities/request.entity'
import { QuizAttemptService } from './quiz_attempt.service'
import { QuizAttemptController } from './quiz_attempt.controller'
import { QuizAttempt } from './entities/quiz_attempt.entity'
import { QuizService } from 'src/quizzes/quiz.service'
import { QuestionService } from 'src/questions/question.service'

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
    ]),
  ],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService, QuizService, QuestionService],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}
