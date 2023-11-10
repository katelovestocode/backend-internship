import { Invitation } from 'src/invitations/entities/invitation.entity'
import { User } from '../../user/entities/user.entity'
import { Request } from 'src/requests/entities/request.entity'
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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
