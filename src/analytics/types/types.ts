export type UserAverageRatingRes = {
  status_code: number
  result: string
  details: UserAverageRatingDetails
}

export type UserAverageRatingDetails = {
  averageRating: number
  userId: number
  userName: string
}

export type QuizzAverageResponse = {
  status_code: number
  result: string
  details: Details
}

export type Details = {
  analytics: Analytics[]
}

export type Analytics = {
  userId: number
  userName: string
  quizAttemptId: number
  quizAvarage: number
  quizTime: Date
}
