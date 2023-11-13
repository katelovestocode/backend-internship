import { Company } from 'src/company/entities/company.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Question } from '../../questions/entities/question.entity'
import { UserQuizResult } from 'src/user_quiz_results/entities/user_quiz_results.entity'

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  frequencyInDays: number

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[]

  @ManyToOne(() => Company, (company) => company.quizzes)
  company: Company

  // user's quiz results
  @OneToMany(() => UserQuizResult, (userResult) => userResult.quiz)
  userResults: UserQuizResult[]
}
