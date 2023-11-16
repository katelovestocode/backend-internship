import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { QuizzAverageResponse, UserAverageRatingRes } from './types/types'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // USER ANALYTICS
  // get user's avarage rating of all quiz attempts in the system
  async getUserAverage(userId: number): Promise<UserAverageRatingRes> {
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

      user.quizAttempts.forEach((attempt) => {
        totalRating += attempt.overallRatingAcrossSystem
        totalAttempts++
      })

      const averageRating = totalAttempts > 0 ? totalRating / totalAttempts : 0

      return {
        status_code: HttpStatus.OK,
        result: 'User average rating had been calculated',
        details: {
          userId: user.id,
          userName: user.name,
          averageRating: Number(averageRating.toFixed(0)),
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // get list of the avarage rating particular quiz attempt in all companies
  async getUserQuizAverages(
    userId: number,
    quizId: number,
  ): Promise<QuizzAverageResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz',
          'quizAttempts.user',
          'quizAttempts.quiz.company',
        ],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      const filteredQuiz = user.quizAttempts.filter(
        (attempt) => attempt.quiz.id === quizId,
      )

      if (filteredQuiz.length === 0) {
        throw new NotFoundException(
          'Quiz attempts are not found for the user and quiz attempt',
        )
      }

      const analytics = filteredQuiz.map((quiz) => {
        return {
          userId: userId,
          userName: quiz.user.name,
          quizAttemptId: quiz.id,
          quizAvarage: quiz.overallRatingAcrossSystem,
          quizTime: quiz.timestamp,
        }
      })

      return {
        status_code: HttpStatus.OK,
        result: `User average ratings in quiz #${quizId}`,
        details: {
          analytics: analytics,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // get list of all user's quiz attempts
  async getUserAllQuizAverages(userId: number): Promise<QuizzAverageResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz',
          'quizAttempts.user',
          'quizAttempts.quiz.company',
        ],
      })

      if (!user) {
        throw new NotFoundException('User is not found')
      }

      const analytics = user.quizAttempts.map((quiz) => {
        return {
          userId: userId,
          userName: quiz.user.name,
          quizAttemptId: quiz.id,
          quizAvarage: quiz.overallRatingAcrossSystem,
          quizTime: quiz.timestamp,
        }
      })

      return {
        status_code: HttpStatus.OK,
        result: `User average ratings in all quizzes`,
        details: {
          analytics: analytics,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY OWNER OR ADMIN ANALYTICS
  // company owner or admin can get list of all user's quiz attempts in their company
  async getAllUsersInCompResuts(
    companyId: number,
  ): Promise<QuizzAverageResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz',
          'quizAttempts.quiz.company',
          'quizAttempts.user',
        ],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const analytics = company.quizAttempts.map((quiz) => {
        return {
          userId: quiz.user.id,
          userName: quiz.user.name,
          quizAttemptId: quiz.id,
          quizAvarage: quiz.averageScoreWithinCompany,
          quizTime: quiz.timestamp,
        }
      })

      return {
        status_code: HttpStatus.OK,
        result: `List of all users average ratings in company quizzes`,
        details: {
          analytics: analytics,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get list of one user quiz attempts in their company
  async getUserInCompResuts(
    companyId: number,
    userId: number,
  ): Promise<QuizzAverageResponse> {
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

      const filteredQuizzes = company.quizAttempts.filter(
        (attempt) => attempt.user.id === userId,
      )

      if (filteredQuizzes.length === 0) {
        throw new NotFoundException(
          'Quiz attempts are not found for the provided user',
        )
      }

      const analytics = filteredQuizzes.map((quiz) => {
        return {
          userId: userId,
          userName: quiz.user.name,
          quizAttemptId: quiz.id,
          quizAvarage: quiz.averageScoreWithinCompany,
          quizTime: quiz.timestamp,
        }
      })

      return {
        status_code: HttpStatus.OK,
        result: `List of user id #${userId} average ratings in company quizzes`,
        details: {
          analytics: analytics,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner or admin can get list of all user's quiz LAST attempts in their company
  async getAllLatestQuizResults(
    companyId: number,
  ): Promise<QuizzAverageResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: [
          'quizAttempts',
          'quizAttempts.quiz',
          'quizAttempts.quiz.company',
          'quizAttempts.user',
        ],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const filteredAttempts = company.quizAttempts.filter(
        (attempt) => attempt.quiz.company.id === companyId,
      )

      if (filteredAttempts.length === 0) {
        throw new NotFoundException(
          'No quiz attempts are found for the company',
        )
      }

      const analytics = filteredAttempts.reduce((result, attempt) => {
        const userId = attempt.user.id

        // checking if user exists in the result array
        const existingUserIndex = result.findIndex(
          (item) => item.userId === userId,
        )

        if (existingUserIndex === -1) {
          // if user doesn't exist, adding them to the result array
          result.push({
            userId: userId,
            userName: attempt.user.name,
            quizAttemptId: attempt.id,
            quizAvarage: attempt.averageScoreWithinCompany,
            quizTime: attempt.timestamp,
          })
        } else {
          // if user exists, updating their details only if the timestamp is latest
          if (attempt.timestamp > result[existingUserIndex].quizTime) {
            result[existingUserIndex] = {
              userId: userId,
              userName: attempt.user.name,
              quizAttemptId: attempt.id,
              quizAvarage: attempt.averageScoreWithinCompany,
              quizTime: attempt.timestamp,
            }
          }
        }

        return result
      }, [])

      return {
        status_code: HttpStatus.OK,
        result: `List of all LAST users average ratings in company quizzes`,
        details: {
          analytics: analytics,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
