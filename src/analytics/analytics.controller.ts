import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // get user's avarage rating of all quiz attempts in the system
  @Get('/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async getUserAnalytics(@Param('userId') userId: string) {
    return await this.analyticsService.getUserAverage(+userId)
  }

  // get list of the avarage rating particular quiz attempt in all companies
  @Get('/users/:userId/quizzes/:quizId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserQuizAnalytics(
    @Param('quizId') quizId: string,
    @Param('userId') userId: string,
  ) {
    return await this.analyticsService.getUserQuizAverages(+userId, +quizId)
  }

  // get list of all user's quiz attempts
  @Get('/users/:userId/quizzes')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserAllQuizAnalytics(@Param('quizId') quizId: string) {
    return await this.analyticsService.getUserAllQuizAverages(+quizId)
  }
}
