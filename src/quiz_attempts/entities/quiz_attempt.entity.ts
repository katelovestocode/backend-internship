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

  @Column({ type: 'float' })
  score: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date
}
