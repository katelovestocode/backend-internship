import { Request } from '../entities/request.entity'

export type AllRequests = {
  status_code: number
  result: string
  details: AllReqDetails
}

type AllReqDetails = {
  requests: Request[]
}

export type JoinRequest = {
  status_code: number
  result: string
  details: ReqDetails
}

export type ReqDetails = {
  request: Request
}
