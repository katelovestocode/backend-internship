import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller('notifications')
export class NotificationsController {
  constructor(readonly notificationsService: NotificationsService) {}

  // get all user's notifications
  @Get('/:userId/all')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getAllNotifications(@Param('userId') userId: string) {
    return await this.notificationsService.getNotifications(+userId)
  }

  // mark notification's status as read
  @Put('/:notificationId/read/:userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async updateNotification(
    @Param('notificationId') notificationId: string,
    @Param('userId') userId: string,
  ) {
    return await this.notificationsService.updateNotificationStatus(
      +notificationId,
      +userId,
    )
  }
}
