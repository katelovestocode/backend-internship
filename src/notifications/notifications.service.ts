import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Notification } from './entities/notification.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageStatus, NewNotification } from './types/types'
import { EventsGateway } from 'src/events/events.gateway'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    readonly notificationsRepository: Repository<Notification>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // create a new notification
  async createNewNotification(data: NewNotification) {
    try {
      await this.notificationsRepository.save(data)

      // send notification to each member of the company
      await this.eventsGateway.sendNotification({
        userId: data.user.id,
        notification: data.text,
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  //get all notifications
  async getNotifications(userId: number) {
    try {
      const allNotifications = await this.notificationsRepository.find({
        where: { status: MessageStatus.UnRead, user: { id: userId } },
      })

      if (!allNotifications) {
        throw new NotFoundException("Can't find any notifications!")
      }
      return {
        status_code: HttpStatus.OK,
        result: 'Notifications have been successfully retrieved',
        details: {
          notifications: allNotifications,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // mark notification's status as read
  async updateNotificationStatus(notificationId: number, userId: number) {
    try {
      const notification = await this.notificationsRepository.findOne({
        where: { id: notificationId },
        relations: ['user'],
      })

      if (notification.user.id !== userId) {
        throw new UnauthorizedException(
          'You can only update, your own notifications',
        )
      }
      if (notification.status !== 'unread') {
        throw new BadRequestException(
          'Notification already has been marked read',
        )
      }

      await this.notificationsRepository.update(notification.id, {
        status: MessageStatus.Read,
      })

      const updatedNotification = await this.notificationsRepository.findOne({
        where: { id: notificationId },
        relations: ['user'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Notification has been marked as read',
        details: {
          notifications: updatedNotification,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
