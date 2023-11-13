import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { QuestionService } from './question.service'
import { QuestionDto } from 'src/quizzes/dto/create-quiz.dto'
import { AuthGuard } from '@nestjs/passport'
import { AdminOrOwnerValidGuard } from 'src/company/guards/admin-validation.guard'
import { DeletedQuestionRes, QuestionResponse } from './types/types'

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // add a question to the quiz
  @Post('/quizzes/:quizId/companies/:companyId/add')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.CREATED)
  async addQuestionToQuiz(
    @Param('quizId') quizId: string,
    @Param('companyId') companyId: string,
    @Body() createQuestionDto: QuestionDto,
  ): Promise<QuestionResponse> {
    return await this.questionService.addQuestionToQuiz(
      +quizId,
      +companyId,
      createQuestionDto,
    )
  }

  // update a question from a quiz
  @Put('/:questionId/quizzes/:quizId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async updateQuestionToQuiz(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() createQuestionDto: QuestionDto,
  ): Promise<QuestionResponse> {
    return await this.questionService.updateOneQuestionToQuiz(
      +quizId,
      +questionId,
      createQuestionDto,
    )
  }

  // delete a question
  @Delete('/:questionId/quizzes/:quizId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async deleteQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ): Promise<DeletedQuestionRes> {
    return await this.questionService.deleteQuestionFromQuiz(
      +quizId,
      +questionId,
    )
  }
}
