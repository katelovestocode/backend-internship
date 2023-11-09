import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { Invitation } from 'src/invitations/entities/invitation.entity'
import { Request } from 'src/requests/entities/request.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth

  // user's companies
  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[]

  @OneToMany(() => Invitation, (invitation) => invitation.inviter)
  sentInvitations: Invitation[]

  @OneToMany(() => Invitation, (invitation) => invitation.invitee)
  receivedInvitations: Invitation[]

  @OneToMany(() => Request, (request) => request.requester)
  sentRequests: Request[]

  // user is a member of other companies
  @ManyToMany(() => Company, (company) => company.members)
  reqCompanies: Company[]

  // user is an admin of the company
  @ManyToMany(() => Company, (company) => company.admins)
  adminCompanies: Company[];
  
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
