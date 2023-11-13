import { Company } from 'src/company/entities/company.entity'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { User } from 'src/user/entities/user.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm'
import { QuestionResponse } from './question_response.entity'

@Entity('user_quiz_results')
export class UserQuizResult {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.quizResults)
  user: User

  @ManyToOne(() => Quiz, (quiz) => quiz.userResults)
  quiz: Quiz

  @ManyToOne(() => Company, (company) => company.userQuizResults)
  company: Company

  @Column()
  score: number

  @OneToMany(() => QuestionResponse, (response) => response.userQuizResult)
  responses: QuestionResponse[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date
}
