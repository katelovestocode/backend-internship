import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { Repository } from 'typeorm'
import { QuizAttempt } from './entities/quiz_attempt.entity'
import { CreateQuizAttemptDto } from './dto/create-quiz_attempt.dto'
import { User } from 'src/user/entities/user.entity'
import { QuizAttemptRes } from './types/types'

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
  ) {}

  async userSubmitsQuiz(
    userId: number,
    quizId: number,
    createQuizAttemptDto: CreateQuizAttemptDto,
  ): Promise<QuizAttemptRes> {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id: quizId },
        relations: ['questions', 'company'],
      })

      if (!quiz) {
        throw new NotFoundException('Quiz is not found')
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      const submittedQuiz = await this.calculateUserQuizResult(
        user,
        quiz,
        createQuizAttemptDto,
      )

      await this.calculateStatistics(userId, quiz)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Quiz has been successfully submitted',
        details: {
          quiz: submittedQuiz,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  private async calculateUserQuizResult(
    user: User,
    quiz: Quiz,
    createQuizAttemptDto: CreateQuizAttemptDto,
  ) {
    try {
      const { questions } = createQuizAttemptDto

      let totalCorrect = 0
      let totalQuestions = 0

      const questionResponses: Array<{
        id: number
        question: string
        answer: string
        isCorrect: boolean
      }> = []

      function normalize(str: string): string {
        return str.trim().toLowerCase()
      }

      for (const userAnswer of questions) {
        const question = quiz.questions.find((q) => q.id === userAnswer.id)

        if (question) {
          const normalizedUserAnswer = normalize(userAnswer.answer)
          const normalizedCorrectAnswer = normalize(question.correctAnswer)

          const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer

          questionResponses.push({
            id: question.id,
            question: question.question,
            answer: userAnswer.answer,
            isCorrect,
          })

          if (isCorrect) {
            totalCorrect++
          }

          totalQuestions++
        }
      }

      const score =
        totalQuestions > 0
          ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2))
          : 0

      const userQuizResult = this.quizAttemptRepository.create({
        user,
        quiz,
        score,
        company: quiz.company,
        questionResponses,
        timestamp: new Date(),
      })

      await this.quizAttemptRepository.save(userQuizResult)

      return userQuizResult
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  private async calculateStatistics(userId: number, quiz) {
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

      const companyQuizAttempts = user.quizAttempts.filter(
        (attempt) => attempt.quiz.company.id === quiz.company.id,
      )

      const averageScoreWithinCompany =
        companyQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
        companyQuizAttempts.length

      user.averageScoreWithinCompany = Number(
        averageScoreWithinCompany.toFixed(2),
      )

      //   // Calculate and update overallRatingAcrossSystem
      //   const allQuizAttempts = user.quizAttempts
      //   const overallRatingAcrossSystem =
      //     allQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
      //     allQuizAttempts.length

      //   user.overallRatingAcrossSystem = Number(overallRatingAcrossSystem)

      const allUsers = await this.userRepository.find({
        relations: ['quizAttempts'],
      })

      const overallRatingAcrossSystem =
        allUsers.reduce((sum, currentUser) => {
          // Exclude the current user from the calculation
          if (
            currentUser.id !== user.id &&
            currentUser.quizAttempts.length > 0
          ) {
            const userAverageScore =
              currentUser.quizAttempts.reduce(
                (userSum, attempt) => userSum + attempt.score,
                0,
              ) / currentUser.quizAttempts.length

            return sum + userAverageScore
          }
          return sum
        }, 0) / Math.max(allUsers.length - 1, 1)

      user.overallRatingAcrossSystem = Number(
        overallRatingAcrossSystem.toFixed(2),
      )

      await this.userRepository.save(user)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}