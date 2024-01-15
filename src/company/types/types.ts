import { User } from 'src/user/entities/user.entity'
import { Company } from '../entities/company.entity'

export type AllCompaniesResponse = {
  status_code: number
  result: string
  details: AllCompaniesDetails
}

type AllCompaniesDetails = {
  companies: Company[]
}

export type CompanyResponse = {
  status_code: number
  result: string
  details: CompanyDetails
}

export type CompanyDetails = {
  company: Company
}

export type DeletedCompanyResponse = {
  status_code: number
  result: string
  details: IdReturnType
}

type IdReturnType = {
  company: number
}

export enum InvitationStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
  Cancelled = 'cancelled',
}

export enum RequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
  Cancelled = 'cancelled',
}

export type CompaniesResponse = {
  status_code: number
  result: string
  details: { list: User }
}
