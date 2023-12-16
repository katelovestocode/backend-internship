import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Quiz } from './entities/quiz.entity'
import { Question } from 'src/questions/entities/question.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { Company } from 'src/company/entities/company.entity'
import { QuestionService } from 'src/questions/question.service'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { AllQuizzesResponse, DeletedQuizRes, QuizResponse } from './types/types'
import { NotificationsService } from 'src/notifications/notifications.service'

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly questionService: QuestionService,
    readonly notificationsService: NotificationsService,
  ) {}

  // get all quizzes
  async getAllQuizzesForCompany(
    companyId: number,
  ): Promise<AllQuizzesResponse> {
    try {
      const quizzes = await this.quizRepository.find({
        where: { company: { id: companyId } },
        relations: ['questions'],
      })

      if (!quizzes) {
        throw new NotFoundException('Quizzes are not found')
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quizzes have been successfully retrieved',
        details: {
          quizzes: quizzes,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // get one quiz details
  async getOneQuizDetails(
    quizId: number,
    companyId: number,
  ): Promise<QuizResponse> {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id: quizId, company: { id: companyId } },
        relations: ['questions'],
      })

      if (!quiz) {
        throw new NotFoundException('Quiz is not found')
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz has been successfully retrieved',
        details: {
          quiz: quiz,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // create a quiz
  async createNewQuiz(
    companyId: number,
    createQuizDto: CreateQuizDto,
  ): Promise<QuizResponse> {
    try {
      const { title, description, questions, frequencyInDays } = createQuizDto

      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['members'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      if (createQuizDto.questions) {
        for (const questionDto of createQuizDto.questions) {
          if (
            questionDto.answers &&
            new Set(questionDto.answers).size !== questionDto.answers.length
          ) {
            throw new BadRequestException('Answers must be unique')
          }
          if (
            questionDto.correctAnswer &&
            questionDto.answers &&
            !questionDto.answers.includes(questionDto.correctAnswer)
          ) {
            throw new BadRequestException(
              'Correct answer must be one of the provided answers',
            )
          }
        }
      }

      const quiz = this.quizRepository.create({
        title,
        description,
        frequencyInDays,
        company,
      })

      const savedQuiz = await this.quizRepository.save(quiz)

      await this.questionService.createQuestions(savedQuiz, questions)

      const newQuizz = await this.quizRepository.findOneOrFail({
        where: { id: savedQuiz.id },
        relations: ['questions'],
      })

      // send notification of the created quiz
      await this.sendNewQuizNotification(company, newQuizz.title)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Quiz has been successfully created',
        details: {
          quiz: newQuizz,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // update a quiz
  async updateQuiz(
    quizId: number,
    companyId: number,
    updateQuizDto: UpdateQuizDto,
  ): Promise<QuizResponse> {
    try {
      const { title, description, frequencyInDays } = updateQuizDto

      const quiz = await this.quizRepository.findOne({
        where: { id: quizId, company: { id: companyId } },
        relations: ['questions'],
      })

      if (!quiz) {
        throw new NotFoundException('Quiz is not found')
      }

      if (title) {
        quiz.title = title
      }

      if (description) {
        quiz.description = description
      }

      if (frequencyInDays) {
        quiz.frequencyInDays = frequencyInDays
      }

      const updatedQuiz = await this.quizRepository.save(quiz)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Quiz has been successfully updated',
        details: {
          quiz: updatedQuiz,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async deleteOneQuiz(quizId: number): Promise<DeletedQuizRes> {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id: quizId },
        relations: ['questions'],
      })

      if (!quiz) {
        throw new NotFoundException('Quiz is not found')
      }

      await this.questionRepository.remove(quiz.questions)
      await this.quizRepository.remove(quiz)

      return {
        status_code: HttpStatus.OK,
        result: 'Quiz has been successfully deleted',
        details: {
          quiz: quizId,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Send notification to all members of the company that the quiz has been created
  async sendNewQuizNotification(company: Company, quizTitle: string) {
    try {
      if (!company.members) {
        throw new NotFoundException('No members were found')
      }

      const text = `New quiz "${quizTitle}" has been created in the company ${company.name}`

      await Promise.all(
        company.members.map(async (user) => {
          await this.notificationsService.createNewNotification({
            user,
            company,
            text,
          })
        }),
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
