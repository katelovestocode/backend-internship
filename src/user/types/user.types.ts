import { User } from '../entities/user.entity'

export type AllUsersResponse = {
  status_code: number;
  result: string;
  details: AllUsersDetails;

}

type AllUsersDetails = {
  users: User[] 
}

export type UserResponse = {
  status_code: number;
  result: string;
  details: UserDetails;
}

type UserDetails = {
  user: User
}


export type DeletedUserResponse = {
  status_code: number;
  result: string;
  details: IdReturnType;
}

type IdReturnType = {
  user: number
}