import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'

export type CachedDataType = {
  id: number
  user: User
  quiz: Quiz
  company: Quiz['company']
  totalQuestions: number
  totalCorrect: number
  questionResponses: Array<{
    id: number
    question: string
    answer: string
    isCorrect: boolean
  }>
  averageScoreWithinCompany: number
  overallRatingAcrossSystem: number
  timestamp: Date
}
