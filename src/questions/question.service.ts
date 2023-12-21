import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Question } from './entities/question.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { QuestionDto } from 'src/quizzes/dto/create-quiz.dto'
import { UpdateQuestionDto } from 'src/quizzes/dto/update-quiz.dto'
import { DeletedQuestionRes, QuestionResponse } from './types/types'

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async createQuestions(quiz: Quiz, questions: QuestionDto[]): Promise<void> {
    try {
      const quizQuestions = questions?.map((q) =>
        this.questionRepository.create({
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correctAnswer,
          quiz: quiz,
        }),
      )

      if (quizQuestions && quizQuestions.length > 0) {
        await this.questionRepository.save(quizQuestions)
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // add a question to the quiz
  async addQuestionToQuiz(
    quizId: number,
    companyId: number,
    createQuestionDto: QuestionDto,
  ): Promise<QuestionResponse> {
    try {
      const { question, answers, correctAnswer } = createQuestionDto

      const quiz = await this.quizRepository.findOne({
        where: { id: quizId, company: { id: companyId } },
        relations: ['questions'],
      })

      if (!quiz) {
        throw new NotFoundException('Quiz is not found')
      }

      if (createQuestionDto.answers) {
        if (
          new Set(createQuestionDto.answers).size !==
          createQuestionDto.answers.length
        ) {
          throw new BadRequestException('Answers must be unique')
        }

        if (
          createQuestionDto.correctAnswer &&
          !createQuestionDto.answers.includes(createQuestionDto.correctAnswer)
        ) {
          throw new BadRequestException(
            'Correct answer must be one of the provided answers',
          )
        }
      }

      const newQuestion = this.questionRepository.create({
        question,
        answers,
        correctAnswer,
        quiz,
      })

      await this.questionRepository.save(newQuestion)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Question has been successfully added',
        details: {
          question: newQuestion,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // update a question from a quiz
  async updateOneQuestionToQuiz(
    quizId: number,
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionResponse> {
    try {
      const existingQuestion = await this.questionRepository.findOne({
        where: { id: questionId, quiz: { id: quizId } },
      })

      if (!existingQuestion) {
        throw new NotFoundException('Question is not found')
      }

      if (updateQuestionDto.answers) {
        if (
          new Set(updateQuestionDto.answers).size !==
          updateQuestionDto.answers.length
        ) {
          throw new BadRequestException('Answers must be unique')
        }

        if (
          updateQuestionDto.correctAnswer &&
          !updateQuestionDto.answers.includes(updateQuestionDto.correctAnswer)
        ) {
          throw new BadRequestException(
            'Correct answer must be one of the provided answers',
          )
        }
      }
      existingQuestion.question = updateQuestionDto.question
      existingQuestion.answers = updateQuestionDto.answers
      existingQuestion.correctAnswer = updateQuestionDto.correctAnswer

      const updatedQuestion =
        await this.questionRepository.save(existingQuestion)

      return {
        status_code: HttpStatus.OK,
        result: 'Question has been successfully updated',
        details: {
          question: updatedQuestion,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // delete a question
  async deleteQuestionFromQuiz(
    quizId: number,
    questionId: number,
  ): Promise<DeletedQuestionRes> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: questionId, quiz: { id: quizId } },
      })

      if (!question) {
        throw new NotFoundException('Question is not found')
      }

      await this.questionRepository.remove(question)
      return {
        status_code: HttpStatus.OK,
        result: 'Question has been successfully deleted',
        details: {
          question: questionId,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
