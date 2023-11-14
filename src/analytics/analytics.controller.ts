import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // get user's avarage quiz result in the system
  @Get('/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async getUserAnalytics(@Param('userId') userId: string) {
    return await this.analyticsService.getUserAverage(+userId)
  }

  // get user's list of avarage quiz result in the system
  @Get('/users/:userId/all')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserAllAnalytics(@Param('quizId') quizId: string) {
    return await this.analyticsService.getUserAllAverage(+quizId)
  }

  // get user's list quizzes
  @Get('/users/:userId/quizzes')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserAllQuizAnalytics(@Param('quizId') quizId: string) {
    return await this.analyticsService.getUserAllQuizAnalysis(+quizId)
  }
}
