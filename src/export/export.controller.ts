import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ExportService } from './export.service'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { AdminOrOwnerValidGuard } from 'src/company/guards/admin-validation.guard'
import { QuizAttemptRes } from './types/types'

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  // user can get their own quiz results
  // export/users/33?type=csv
  @Get('/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportUserQuizResults(
    @Param('userId') userId: string,
    @Query('type') type: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportUserQuizResults(+userId, type)
  }

  // company owner or admin can get company related user's quiz results
  // export/companies/26/users/33?type=csv
  @Get('/companies/:companyId/users/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportOneUserQuizResults(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Query('type') type: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportOneUserQuizResults(
      +companyId,
      +userId,
      type,
    )
  }

  // company owner or admin can get company related ALL user's quiz results
  @Get('/companies/:companyId/users')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportAllUsersQuizResults(
    @Param('companyId') companyId: string,
    @Query('type') type: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportAllQuizResults(+companyId, type)
  }

  // company owner or admin can get company related user's quiz result by quiz id
  // export/companies/26/users/33/quiz/27?type=json
  @Get('/companies/:companyId/users/:userId/quiz/:quizId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportUserSpecificQuizResult(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Param('quizId') quizId: string,
    @Query('type') type: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportUserQuizResult(
      +companyId,
      +userId,
      +quizId,
      type,
    )
  }
}
