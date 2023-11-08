import { Company } from 'src/company/entities/company.entity'
import { InvitationStatus } from 'src/company/types/types'
import { User } from 'src/user/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.sentInvitations)
  inviter: User

  @ManyToOne(() => User, (user) => user.receivedInvitations)
  invitee: User

  @ManyToOne(() => Company, (company) => company.invitations)
  company: Company

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.Pending,
  })
  status: InvitationStatus
}
