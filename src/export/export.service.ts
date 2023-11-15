import {
  BadRequestException,
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
  async exportUserQuizResults(userId: number, fileType: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['quizAttempts'],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      const key = `quiz_attempts:${userId}:${fileType}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (fileType === 'json') {
          exportedData = user.quizAttempts
        } else if (fileType === 'csv') {
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
            questionResponses: JSON.stringify(attempt.questionResponses),
          }))

          exportedData = Papa.unparse(flattenedData)

          if (!exportedData) {
            throw new InternalServerErrorException('Error exporting to CSV')
          }
        } else {
          throw new BadRequestException('Invalid file type')
        }

        this.redisService.set(key, exportedData, CACHE_EXPIRY_TIME_SECONDS)
        return exportedData
      }

      return cachedData
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get company related user's quiz results
  async exportOneUserQuizResults(
    companyId: number,
    userId: number,
    fileType: string,
  ) {
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

      const key = `quiz_attempts:${userId}:${companyId}:${fileType}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (fileType === 'json') {
          exportedData = user.quizAttempts

        } else if (fileType === 'csv') {
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
       
        this.redisService.set(key, exportedData, CACHE_EXPIRY_TIME_SECONDS)
        return exportedData
      }
      return cachedData
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get company related user's quiz results
  async exportAllQuizResults(companyId: number, fileType: string) {
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

      const key = `quiz_attempts:all_users:${companyId}:${fileType}`
      const cachedData = await this.redisService.get(key)

      if (!cachedData) {
        let exportedData

        if (fileType === 'json') {
          exportedData = company.quizAttempts
        } else if (fileType === 'csv') {
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

        this.redisService.set(key, exportedData, CACHE_EXPIRY_TIME_SECONDS)
        return exportedData
      }

      return cachedData
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
