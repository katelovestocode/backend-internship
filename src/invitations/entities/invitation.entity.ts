import { Company } from 'src/company/entities/company.entity'
import { InvitationStatus } from 'src/company/types/types'
import { User } from 'src/user/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.sentInvitations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  inviter: User

  @ManyToOne(() => User, (user) => user.receivedInvitations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  invitee: User

  @ManyToOne(() => Company, (company) => company.invitations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  company: Company

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.Pending,
  })
  status: InvitationStatus
}
