
import { User } from '../../user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.companies)
  @JoinTable()
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}