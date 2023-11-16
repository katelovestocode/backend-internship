import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  @Get('users/:userId/:fileType')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportUserQuizResults(
    @Param('userId') userId: string,
    @Param('fileType') fileType: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportUserQuizResults(+userId, fileType)
  }

  // company owner or admin can get company related user's quiz results
  @Get('/companies/:companyId/users/:userId/:fileType')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportOneUserQuizResults(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Param('fileType') fileType: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportOneUserQuizResults(
      +companyId,
      +userId,
      fileType,
    )
  }

  // company owner or admin can get company related ALL user's quiz results
  @Get('/companies/:companyId/users/:fileType')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportAllUsersQuizResults(
    @Param('companyId') companyId: string,
    @Param('fileType') fileType: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportAllQuizResults(+companyId, fileType)
  }

  // company owner or admin can get company related user's quiz result by quiz id
  @Get('/companies/:companyId/users/:userId/quiz/:quizId/:fileType')
  @UseGuards(AuthGuard(['jwt', 'auth0']), AdminOrOwnerValidGuard)
  @HttpCode(HttpStatus.OK)
  async exportUserSpecificQuizResult(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Param('quizId') quizId: string,
    @Param('fileType') fileType: string,
  ): Promise<QuizAttemptRes> {
    return await this.exportService.exportUserQuizResult(
      +companyId,
      +userId,
      +quizId,
      fileType,
    )
  }
}
