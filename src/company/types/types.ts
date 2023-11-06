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
