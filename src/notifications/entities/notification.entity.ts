import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { MessageStatus } from '../types/types'

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UnRead,
  })
  status: MessageStatus

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Company, (company) => company.notifications)
  @JoinColumn({ name: 'companyId' })
  company: Company

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
