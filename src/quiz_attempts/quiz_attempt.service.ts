import {
  ForbiddenException,
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
import { RedisService } from 'src/redis/redis.service'
import dayjs from 'dayjs'

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
    private readonly redisService: RedisService,
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
        relations: ['quizAttempts', 'quizAttempts.quiz.company'],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      // Check if the user has submitted the quiz before
      const previousAttempts = user.quizAttempts
        .filter((attempt) => attempt.quiz.id === quizId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      const currentDate = dayjs()
      const nextAvailableAttempt = dayjs(previousAttempts[0].timestamp).add(
        quiz.frequencyInDays,
        'day',
      )

      if (currentDate < nextAvailableAttempt) {
        const hourDifference = nextAvailableAttempt.diff(currentDate, 'hour')
        const minutesDifference = nextAvailableAttempt.diff(currentDate, 'minute') % 60

        throw new ForbiddenException(
          `Quiz will be available in ${hourDifference} hour ${minutesDifference} minutes`,
        )
      }

      const submittedQuiz = await this.calculateUserQuizResult(
        user,
        quiz,
        createQuizAttemptDto,
      )

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
  ): Promise<QuizAttempt> {
    try {
      const { questions } = createQuizAttemptDto

      const questionResponses: Array<{
        id: number
        question: string
        answer: string
        isCorrect: boolean
      }> = []

      function normalize(str: string): string {
        return str.trim().toLowerCase()
      }

      questions.forEach((userAnswer) => {
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
        }
      })

      const totalQuestions = questionResponses.length
      const totalCorrect = questionResponses.filter(
        (response) => response.isCorrect,
      ).length

      const averageScoreWithinCompany = await this.calculateAvarageInCompany(
        user,
        quiz,
        totalCorrect,
        totalQuestions,
      )

      const overallRatingAcrossSystem = await this.calculateRatingInSystem(
        user,
        totalCorrect,
        totalQuestions,
      )

      const userQuizResult = this.quizAttemptRepository.create({
        user,
        quiz,
        totalQuestions,
        totalCorrect,
        averageScoreWithinCompany,
        overallRatingAcrossSystem,
        company: quiz.company,
        questionResponses,
        timestamp: new Date(),
      })

      // check for cache first
      const cachedResponse = await this.redisService.get(
        `quiz_responses:${user.id}:${quiz.id}:${quiz.company}`,
      )

      if (cachedResponse) {
        return cachedResponse
      }

      // otherwise set into database and into Redis
      await this.quizAttemptRepository.save(userQuizResult)

      this.redisService.set(
        `quiz_responses:${user.id}:${quiz.id}:${quiz.company}`,
        { user: user, quiz: quiz, company: quiz.company, questionResponses },
        48 * 60 * 60,
      )

      return userQuizResult
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // average within a company
  private async calculateAvarageInCompany(
    user: User,
    quiz: Quiz,
    totalCorrect: number,
    totalQuestions: number,
  ) {
    try {
      const companyQuizAttempts = user.quizAttempts.filter(
        (attempt) => attempt.quiz.company.id === quiz.company.id,
      )

      let totalCorrectWithinCompany = companyQuizAttempts.reduce(
        (sum, attempt) => sum + attempt.totalCorrect,
        0,
      )

      let totalQuestionsWithinCompany = companyQuizAttempts.reduce(
        (sum, attempt) => sum + attempt.totalQuestions,
        0,
      )

      totalCorrectWithinCompany += totalCorrect
      totalQuestionsWithinCompany += totalQuestions

      const averageScoreWithinCompany =
        totalQuestionsWithinCompany > 0
          ? parseFloat(
              (
                (totalCorrectWithinCompany / totalQuestionsWithinCompany) *
                100
              ).toFixed(0),
            )
          : 0
      return averageScoreWithinCompany
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // average accross the system
  private async calculateRatingInSystem(
    user: User,
    totalCorrect: number,
    totalQuestions: number,
  ) {
    try {
      const allUsers = await this.userRepository.find({
        relations: ['quizAttempts', 'quizAttempts.quiz.company'],
      })

      const totalCorrectAcrossSystem = allUsers.reduce((sum, currentUser) => {
        let userTotalCorrect = currentUser.quizAttempts.reduce(
          (userSum, attempt) => userSum + attempt.totalCorrect,
          0,
        )

        if (currentUser.id === user.id) {
          userTotalCorrect += totalCorrect
        }

        return sum + userTotalCorrect
      }, 0)

      const totalQuestionsAcrossSystem = allUsers.reduce((sum, currentUser) => {
        let userTotalQuestions = currentUser.quizAttempts.reduce(
          (userSum, attempt) => userSum + attempt.totalQuestions,
          0,
        )

        if (currentUser.id === user.id) {
          userTotalQuestions += totalQuestions
        }

        return sum + userTotalQuestions
      }, 0)

      const overallRatingAcrossSystem =
        totalQuestionsAcrossSystem > 0
          ? parseFloat(
              (
                (totalCorrectAcrossSystem / totalQuestionsAcrossSystem) *
                100
              ).toFixed(0),
            )
          : 0

      return overallRatingAcrossSystem
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
