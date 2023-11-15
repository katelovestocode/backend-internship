import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'

export interface CachedDataType extends QuizAttempt {
  user: User
  quiz: Quiz
  company: Quiz['company']
  questionResponses: Array<{
    id: number
    question: string
    answer: string
    isCorrect: boolean
  }>
}
