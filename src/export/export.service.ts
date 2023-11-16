import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisService } from 'src/redis/redis.service'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import Papa from 'papaparse'
import { Company } from 'src/company/entities/company.entity'
import { QuizAttemptRes } from './types/types'

const CACHE_EXPIRY_TIME_SECONDS = 48 * 60 * 60
@Injectable()
export class ExportService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // user can get their own quiz results
  async exportUserQuizResults(
    userId: number,
    type: string,
  ): Promise<QuizAttemptRes> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['quizAttempts'],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      const key = `quiz_attempts:${userId}:${type}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (type === 'json') {
          exportedData = user.quizAttempts
        } else if (type === 'csv') {
          const quizAttemptsData = user.quizAttempts.map((attempt) => ({
            id: attempt.id,
            questionResponses: attempt.questionResponses.map((response) => ({
              id: response.id,
              question: response.question,
              answer: response.answer,
              isCorrect: response.isCorrect,
            })),
            totalQuestions: attempt.totalQuestions,
            totalCorrect: attempt.totalCorrect,
            averageScoreWithinCompany: attempt.averageScoreWithinCompany,
            overallRatingAcrossSystem: attempt.overallRatingAcrossSystem,
            timestamp: attempt.timestamp,
          }))

          const flattenedData = quizAttemptsData.map((attempt) => ({
            ...attempt,
            questionResponses: attempt.questionResponses.map(
              (attempt) => attempt.question,
            ),
          }))

          exportedData = Papa.unparse(flattenedData)

          if (!exportedData) {
            throw new InternalServerErrorException('Error exporting to CSV')
          }
        } else {
          throw new BadRequestException('Invalid file type')
        }

        await this.redisService.set(
          key,
          exportedData,
          CACHE_EXPIRY_TIME_SECONDS,
        )

        return exportedData
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz results have been successfully retrieved',
        details: {
          data: cachedData,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get company related user's quiz results
  async exportOneUserQuizResults(
    companyId: number,
    userId: number,
    type: string,
  ): Promise<QuizAttemptRes> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz.company',
          'quizAttempts.user',
        ],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      // filtering quiz attempts based on the companyId
      user.quizAttempts = user.quizAttempts.filter(
        (attempt) => attempt.quiz.company.id === companyId,
      )

      const key = `quiz_attempts:${userId}:${companyId}:${type}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (type === 'json') {
          exportedData = user.quizAttempts
        } else if (type === 'csv') {
          const quizAttemptsData = user.quizAttempts.map((attempt) => ({
            id: attempt.id,
            questionResponses: attempt.questionResponses.map((response) => ({
              id: response.id,
              question: response.question,
              answer: response.answer,
              isCorrect: response.isCorrect,
            })),
            totalQuestions: attempt.totalQuestions,
            totalCorrect: attempt.totalCorrect,
            averageScoreWithinCompany: attempt.averageScoreWithinCompany,
            overallRatingAcrossSystem: attempt.overallRatingAcrossSystem,
            userId: attempt.user.id,
            userEmail: attempt.user.email,
            userName: attempt.user.name,
            timestamp: attempt.timestamp,
          }))

          const flattenedData = quizAttemptsData.map((attempt) => ({
            ...attempt,
            userId: attempt.userId,
            userEmail: attempt.userEmail,
            userName: attempt.userName,
            questionResponses: attempt.questionResponses.map(
              (attempt) => attempt.question,
            ),
          }))

          exportedData = Papa.unparse(flattenedData)

          if (!exportedData) {
            throw new InternalServerErrorException('Error exporting to CSV')
          }
        } else {
          throw new BadRequestException('Invalid file type')
        }

        await this.redisService.set(
          key,
          exportedData,
          CACHE_EXPIRY_TIME_SECONDS,
        )

        return exportedData
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz results have been successfully retrieved',
        details: {
          data: cachedData,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get company related user's quiz results
  async exportAllQuizResults(
    companyId: number,
    type: string,
  ): Promise<QuizAttemptRes> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz',
          'quizAttempts.user',
          'quizAttempts.quiz.company',
        ],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      // filtering quiz attempts based on the companyId
      company.quizAttempts = company.quizAttempts.filter(
        (attempt) => attempt.quiz.company.id === companyId,
      )

      const key = `quiz_attempts_all_users:${companyId}:${type}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (type === 'json') {
          exportedData = company.quizAttempts
        } else if (type === 'csv') {
          const quizAttemptsData = company.quizAttempts.map((attempt) => ({
            id: attempt.id,
            questionResponses: attempt.questionResponses.map((response) => ({
              id: response.id,
              question: response.question,
              answer: response.answer,
              isCorrect: response.isCorrect,
            })),
            totalQuestions: attempt.totalQuestions,
            totalCorrect: attempt.totalCorrect,
            averageScoreWithinCompany: attempt.averageScoreWithinCompany,
            overallRatingAcrossSystem: attempt.overallRatingAcrossSystem,
            userId: attempt.user.id,
            userEmail: attempt.user.email,
            userName: attempt.user.name,
            timestamp: attempt.timestamp,
          }))

          const flattenedData = quizAttemptsData.map((attempt) => ({
            ...attempt,
            userId: attempt.userId,
            userEmail: attempt.userEmail,
            userName: attempt.userName,
            questionResponses: attempt.questionResponses.map(
              (attempt) => attempt.question,
            ),
          }))

          exportedData = Papa.unparse(flattenedData)

          if (!exportedData) {
            throw new InternalServerErrorException('Error exporting to CSV')
          }
        } else {
          throw new BadRequestException('Invalid file type')
        }

        await this.redisService.set(
          key,
          exportedData,
          CACHE_EXPIRY_TIME_SECONDS,
        )

        return exportedData
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz results have been successfully retrieved',
        details: {
          data: cachedData,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get company related user's quiz result by quiz id
  async exportUserQuizResult(
    companyId: number,
    userId: number,
    quizId: number,
    type: string,
  ): Promise<QuizAttemptRes> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz.company',
          'quizAttempts.user',
        ],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      // filtering quiz attempts based on the companyId and quiz id
      user.quizAttempts = user.quizAttempts.filter(
        (attempt) =>
          attempt.quiz.company.id === companyId && attempt.quiz.id === quizId,
      )

      const key = `quiz_attempts:${userId}:${companyId}:${quizId}:${type}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (type === 'json') {
          exportedData = user.quizAttempts
        } else if (type === 'csv') {
          const quizAttemptsData = user.quizAttempts.map((attempt) => ({
            id: attempt.id,
            quizTitle: attempt.quiz.title,
            quizDescription: attempt.quiz.description,
            quizFrequency: attempt.quiz.frequencyInDays,
            questionResponses: attempt.questionResponses.map((response) => ({
              id: response.id,
              question: response.question,
              answer: response.answer,
              isCorrect: response.isCorrect,
            })),
            totalQuestions: attempt.totalQuestions,
            totalCorrect: attempt.totalCorrect,
            averageScoreWithinCompany: attempt.averageScoreWithinCompany,
            overallRatingAcrossSystem: attempt.overallRatingAcrossSystem,
            userId: attempt.user.id,
            userEmail: attempt.user.email,
            userName: attempt.user.name,
            timestamp: attempt.timestamp,
          }))

          const flattenedData = quizAttemptsData.map((attempt) => ({
            ...attempt,
            quizTitle: attempt.quizTitle,
            quizDescription: attempt.quizDescription,
            quizFrequency: attempt.quizFrequency,
            userId: attempt.userId,
            userEmail: attempt.userEmail,
            userName: attempt.userName,
            questionResponses: attempt.questionResponses.map(
              (attempt) => attempt.question,
            ),
          }))

          exportedData = Papa.unparse(flattenedData)

          if (!exportedData) {
            throw new InternalServerErrorException('Error exporting to CSV')
          }
        } else {
          throw new BadRequestException('Invalid file type')
        }

        await this.redisService.set(
          key,
          exportedData,
          CACHE_EXPIRY_TIME_SECONDS,
        )

        return exportedData
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz results have been successfully retrieved',
        details: {
          data: cachedData,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
