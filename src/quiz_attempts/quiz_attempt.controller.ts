import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Body,
  UseInterceptors,
  Get,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { CreateQuizAttemptDto } from './dto/create-quiz_attempt.dto'
import { QuizAttemptService } from './quiz_attempt.service'
import { FilteredQuizAttemptsType, QuizAttemptRes } from './types/types'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller('')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  // { "questions": [{"id": 99,"answer": "George Washington"},{ "id": 100,"answer": "1939"},{"id": 101,"answer": "Egyptian" }]}
  @UseInterceptors(CacheInterceptor)
  @Post('/users/:userId/quizzes/:quizId/submit')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.CREATED)
  async userSubmitsNewQuiz(
    @Param('userId') userId: string,
    @Param('quizId') quizId: string,
    @Body() createQuizAttemptDto: CreateQuizAttemptDto,
  ): Promise<QuizAttemptRes> {
    return await this.quizAttemptService.userSubmitsQuiz(
      +userId,
      +quizId,
      createQuizAttemptDto,
    )
  }

  // all user's quiz attempts
  @Get('/users/:userId/quizzes/attempts')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async userGetsQuizAttempts(
    @Param('userId') userId: string,
  ): Promise<FilteredQuizAttemptsType> {
    return await this.quizAttemptService.userGetsAllQuizAttempts(+userId)
  }
}
