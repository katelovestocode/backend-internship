import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  frequencyInDays: number

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[]
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string

  @IsArray()
  @ArrayMinSize(2)
  answers: string[]

  @IsString()
  @IsNotEmpty()
  correctAnswer: string
}
