import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AnswerDto {
  @IsNumber()
  id: number

  @IsString()
  @IsNotEmpty()
  answer: string
}

export class CreateQuizAttemptDto {
  @IsNotEmpty()
  questions: AnswerDto[]
}
