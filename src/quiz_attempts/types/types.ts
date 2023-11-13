import { QuizAttempt } from '../entities/quiz_attempt.entity'

export type QuizAttemptRes = {
  status_code: number
  result: string
  details: QuizAttemptDetails
}

export type QuizAttemptDetails = {
  quiz: QuizAttempt
}


