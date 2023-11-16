import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AnalyticsService {
  constructor(
    // @InjectRepository(Quiz)
    // private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository(QuizAttempt)
    // private readonly quizAttemptRepository: Repository<QuizAttempt>,
  ) {}

  // get user's avarage rating of all quiz attempts in the system
  async getUserAverage(userId: number) {
    try {
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

      let totalRating = 0
      let totalAttempts = 0

      // Iterate through the user's quiz attempts
      user.quizAttempts.forEach((attempt) => {
        totalRating += attempt.overallRatingAcrossSystem
        totalAttempts++
      })

      // Calculate the average rating
      const averageRating = totalAttempts > 0 ? totalRating / totalAttempts : 0
      console.log(averageRating, "averageRating")
      return {
        userId: user.id,
        averageRating: averageRating.toFixed(0), 
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // get list of the avarage rating particular quiz attempt in all companies
  async getUserQuizAverages(userId: number, quizId: number) {
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

  async getUserAllQuizAverages(userId: number) {
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
