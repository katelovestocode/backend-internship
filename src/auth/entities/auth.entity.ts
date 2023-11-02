import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  accessToken: string

  @Column()
  refreshToken: string

  @Column()
  actionToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => User, { cascade: true }) 
  @JoinColumn()
  user: User; 
  
}
