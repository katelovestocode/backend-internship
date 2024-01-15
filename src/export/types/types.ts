import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'

export type QuizAttemptRes = {
  status_code: number
  result: string
  details: QuizAttemptDetails
}

export type QuizAttemptDetails = {
  data: QuizAttempt
}
