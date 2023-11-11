import { Question } from '../entities/question.entity'

export type QuestionResponse = {
  status_code: number
  result: string
  details: QuestionDetails
}

export type QuestionDetails = {
  question: Question
}

export type DeletedQuestionRes = {
  status_code: number
  result: string
  details: IdReturnType
}

type IdReturnType = {
  question: number
}
