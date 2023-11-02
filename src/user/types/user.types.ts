import { JwtTokens } from 'src/auth/types/auth.types'
import { User } from '../entities/user.entity'

export type AllUsersResponse = {
  status_code: number
  result: string
  details: AllUsersDetails
}

type AllUsersDetails = {
  users: User[]
}

export type UserResponse = {
  status_code: number
  result: string
  details: UserDetails
}

export type UserDetails = {
  user: User
}

export type DeletedUserResponse = {
  status_code: number
  result: string
  details: IdReturnType
}

type IdReturnType = {
  user: number
}

type UserWithTokens = User & JwtTokens;

export type LoginResponse = {
  status_code: number;
  result: string;
  details: {
    user: UserWithTokens;
  };
};