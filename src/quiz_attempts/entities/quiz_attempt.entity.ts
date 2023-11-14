import { Company } from 'src/company/entities/company.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.quizAttempts)
  user: User

  @ManyToOne(() => Quiz, (quiz) => quiz.quizAttempts)
  quiz: Quiz

  @ManyToOne(() => Company, (company) => company.quizAttempts)
  company: Company

  @Column('json')
  questionResponses: Array<{
    id: number
    question: string
    answer: string
    isCorrect: boolean
  }>

  @Column({ default: 0 })
  totalQuestions: number

  @Column({ default: 0 })
  totalCorrect: number

  // average users score in the company
  @Column({ default: 0, type: 'float' })
  averageScoreWithinCompany: number

  // overall user's rating in the system
  @Column({ default: 0, type: 'float' })
  overallRatingAcrossSystem: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date
}
