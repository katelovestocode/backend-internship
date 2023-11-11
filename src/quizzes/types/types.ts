import { Quiz } from '../entities/quiz.entity'

export type AllQuizzesResponse = {
  status_code: number
  result: string
  details: AllQuizzesDetails
}

export type AllQuizzesDetails = {
  quizzes: Quiz[]
}

export type QuizResponse = {
  status_code: number
  result: string
  details: QuizDetails
}

export type QuizDetails = {
  quiz: Quiz
}

export type DeletedQuizRes = {
  status_code: number
  result: string
  details: IdReturnType
}

type IdReturnType = {
  quiz: number
}
