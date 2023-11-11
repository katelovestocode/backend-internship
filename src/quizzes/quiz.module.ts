import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { Invitation } from 'src/invitations/entities/invitation.entity'
import { Question } from 'src/questions/entities/question.entity'
import { User } from 'src/user/entities/user.entity'
import { Quiz } from './entities/quiz.entity'
import { Request } from 'src/requests/entities/request.entity'
import { QuizService } from './quiz.service'
import { QuizController } from './quiz.controller'
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
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService, QuestionService],
  exports: [QuizService],
})
export class QuizModule {}
