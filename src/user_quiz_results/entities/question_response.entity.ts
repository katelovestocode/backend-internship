import { Question } from 'src/questions/entities/question.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { UserQuizResult } from './user_quiz_results.entity'

@Entity('question_responses')
export class QuestionResponse {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => UserQuizResult,
    (userQuizResult) => userQuizResult.questionResponses,
  )
  userQuizResult: UserQuizResult

  @ManyToOne(() => Question, (question) => question.responses)
  question: Question

  @Column()
  selectedOption: number

  @Column({ type: 'boolean' })
  isCorrect: boolean 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date
}
