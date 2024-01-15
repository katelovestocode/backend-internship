import { QuizAttempt } from '../entities/quiz_attempt.entity'

export type QuizAttemptRes = {
  status_code: number
  result: string
  details: QuizAttemptDetails
}

export type QuizAttemptDetails = {
  quiz: QuizAttempt
}

export type FilteredQuizAttemptsType = {
  status_code: number
  result: string
  details: { quizAttempts: QuizAttempt[] }
}
