import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  @IsOptional()
  frequencyInDays: number
}

export class UpdateQuestionDto {
  @IsString()
  question: string

  @IsArray()
  @ArrayMinSize(2)
  answers: string[]

  @IsString()
  correctAnswer: string
}
