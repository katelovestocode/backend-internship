import { Company } from 'src/company/entities/company.entity'
import { RequestStatus } from 'src/company/types/types'
import { User } from 'src/user/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.sentRequests, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requester: User

  @ManyToOne(() => Company, (company) => company.requests, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  company: Company

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.Pending,
  })
  status: RequestStatus
}
