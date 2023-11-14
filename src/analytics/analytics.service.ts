import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
  ) {}
  async getUserAverage(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'quizAttempts',
        'quizAttempts.quiz',
        'quizAttempts.quiz.company',
      ],
    })

    if (!user) {
      throw new NotFoundException('User is not found')
    }
  }

  async getUserAllAverage(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'quizAttempts',
        'quizAttempts.quiz',
        'quizAttempts.quiz.company',
      ],
    })

    if (!user) {
      throw new NotFoundException('User is not found')
    }
  }

  async getUserAllQuizAnalysis(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'quizAttempts',
        'quizAttempts.quiz',
        'quizAttempts.quiz.company',
      ],
    })

    if (!user) {
      throw new NotFoundException('User is not found')
    }
  }
}
