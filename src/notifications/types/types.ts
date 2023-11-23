import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'

export enum MessageStatus {
  Read = 'read',
  UnRead = 'unread',
}

export interface NewNotification {
  text: string
  user: User
  company: Company
}
