import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quiz } from '../../quizzes/entities/quiz.entity'

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('text', { array: true })
  answers: string[];

  @Column()
  correctAnswer: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;
}