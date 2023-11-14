import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { CreateQuizAttemptDto } from './dto/create-quiz_attempt.dto'
import { QuizAttemptService } from './quiz_attempt.service'
import { QuizAttemptRes } from './types/types'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller('')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

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
}
