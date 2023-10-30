import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
