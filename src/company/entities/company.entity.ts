import { Invitation } from 'src/invitations/entities/invitation.entity'
import { User } from '../../user/entities/user.entity'
import { Request } from 'src/requests/entities/request.entity'
import { Notification } from 'src/notifications/entities/notification.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { Quiz } from 'src/quizzes/entities/quiz.entity'
import { QuizAttempt } from 'src/quiz_attempts/entities/quiz_attempt.entity'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @ManyToOne(() => User, (user) => user.companies)
  @JoinTable()
  owner: User

  @OneToMany(() => Invitation, (invitation) => invitation.company)
  invitations: Invitation[]

  @OneToMany(() => Request, (request) => request.company)
  requests: Request[]

  @ManyToMany(() => User, (user) => user.reqCompanies)
  @JoinTable()
  members: User[]

  @ManyToMany(() => User, (user) => user.adminCompanies)
  @JoinTable()
  admins: User[]

  // company quizzes
  @OneToMany(() => Quiz, (quiz) => quiz.company, { cascade: true })
  quizzes: Quiz[]

  // user's quiz results associated with company
  @OneToMany(() => QuizAttempt, (quizAttempt) => quizAttempt.company)
  quizAttempts: QuizAttempt[]

  @OneToMany(() => Notification, (notification) => notification.company)
  notifications: Notification[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
