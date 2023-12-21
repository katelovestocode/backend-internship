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
import { CompanyValidGuard } from 'src/company/guards/company-validation.guard'
import { QuizzAverageResponse, UserAverageRatingRes } from './types/types'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // USER ANALYTICS
  // get user's avarage rating of all quiz attempts in the system
  @Get('/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async getUserAnalytics(
    @Param('userId') userId: string,
  ): Promise<UserAverageRatingRes> {
    return await this.analyticsService.getUserAverage(+userId)
  }

  // get list of the avarage rating particular quiz attempt in all companies
  @Get('/users/:userId/quizzes/:quizId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserQuizAnalytics(
    @Param('quizId') quizId: string,
    @Param('userId') userId: string,
  ): Promise<QuizzAverageResponse> {
    return await this.analyticsService.getUserQuizAverages(+userId, +quizId)
  }

  // get list of all last user's quiz attempts
  @Get('/users/:userId/quizzes')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserAllQuizAnalytics(
    @Param('userId') userId: string,
  ): Promise<QuizzAverageResponse> {
    return await this.analyticsService.getUserAllQuizAverages(+userId)
  }

  // COMPANY OWNER OR ADMIN ANALYTICS
  // company owner or admin can get list of all user's quiz attempts in their company
  @Get('/companies/:companyId/users')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsersInCompQuizResuts(
    @Param('companyId') companyId: string,
  ): Promise<QuizzAverageResponse> {
    return await this.analyticsService.getAllUsersInCompResuts(+companyId)
  }

  // company owner or admin can get list of one user quiz attempts in their company
  @Get('/companies/:companyId/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserInCompQuizResuts(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ): Promise<QuizzAverageResponse> {
    return await this.analyticsService.getUserInCompResuts(+companyId, +userId)
  }

  // company owner or admin can get list of all user's quiz LAST attempts in their company
  @Get('/companies/:companyId/latest')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async getAllLatestQuizAnalytics(
    @Param('companyId') companyId: string,
  ): Promise<QuizzAverageResponse> {
    return await this.analyticsService.getAllLatestQuizResults(+companyId)
  }
}
