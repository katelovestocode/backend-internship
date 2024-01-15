import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationsService } from 'src/notifications/notifications.service'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CronJobService {
  constructor(
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
    private readonly notificationService: NotificationsService,
  ) {}
  private readonly logger = new Logger(CronJobService.name)

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendNtotificationsAboutAvailableQuizzes(): Promise<void> {
    const quizzesToTakeAgain = await this.quizAttemptRepository
      .createQueryBuilder('quizAttempt')
      .leftJoinAndSelect('quizAttempt.quiz', 'quiz')
      .leftJoinAndSelect('quizAttempt.user', 'user')
      .leftJoinAndSelect('quizAttempt.company', 'company')
      .where(
        `quizAttempt.timestamp  + (quiz.frequencyInDays || ' day')::interval < :currentDate`,
        {
          currentDate: new Date(),
        },
      )
      .andWhere((queryBuilder) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('MAX(quiz_attempts.timestamp)', 'maxTimestamp')
          .from(QuizAttempt, 'quiz_attempts')
          .where(
            'quiz_attempts.quiz.id = quiz.id AND quiz_attempts.user.id = user.id',
          )
          .groupBy('quiz_attempts.quiz.id, quiz_attempts.user.id')
          .getQuery()

        return `quizAttempt.timestamp = (${subQuery})`
      })
      .getMany()

    this.logger.log(quizzesToTakeAgain)

    await Promise.all(
      quizzesToTakeAgain.map(async (data) => {
        const text = `The quiz ${data.quiz?.title} is available in the company ${data.company?.name}`

        await this.notificationService.createNewNotification({
          text,
          user: data.user,
          company: data.company,
        })
      }),
    )
  }
}
