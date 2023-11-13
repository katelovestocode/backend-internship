import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { QuizService } from './quiz.service'
import { AuthGuard } from '@nestjs/passport'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { AdminOrOwnerValidGuard } from 'src/company/guards/admin-validation.guard'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { Quiz } from './entities/quiz.entity'
import { AllQuizzesResponse, DeletedQuizRes, QuizResponse } from './types/types'

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // get all quizzes
  @Get('/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async getAllQuizzes(
    @Param('companyId') companyId: string,
  ): Promise<AllQuizzesResponse> {
    return await this.quizService.getAllQuizzesForCompany(+companyId)
  }

  // get one quiz details
  @Get('/:quizId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async getQuizDetails(
    @Param('quizId') quizId: string,
    @Param('companyId') companyId: string,
  ): Promise<QuizResponse> {
    return await this.quizService.getOneQuizDetails(+quizId, +companyId)
  }

  // create a quiz
  @Post('/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuiz(
    @Param('companyId') companyId: string,
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<QuizResponse> {
    return await this.quizService.createNewQuiz(+companyId, createQuizDto)
  }

  // update a quiz
  @Put('/:quizId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Param('companyId') companyId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<QuizResponse>{
    return await this.quizService.updateQuiz(+quizId, +companyId, updateQuizDto)
  }

  // delete a quiz
  @Delete('/:quizId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async deleteQuiz(@Param('quizId') quizId: string): Promise<DeletedQuizRes> {
    return await this.quizService.deleteOneQuiz(+quizId)
  }
}
