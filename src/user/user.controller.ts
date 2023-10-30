import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { UserService } from './user.service'
import {
  DeletedUserResponse,
  UserResponse,
  AllUsersResponse,
} from './types/user.types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get()
  async getAllUsers(): Promise<AllUsersResponse> {
    return await this.userService.getAllUsers()
  }

  // get user by id
  @Get(':id')
  async getOneUser(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.getOneUser(id)
  }

  // create user
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.createUser(createUserDto)
  }

  // update user
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updatedUser: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(id, updatedUser)
  }

  // delete user
  @Delete(':id')
  async removeUser(@Param('id') id: number): Promise<DeletedUserResponse> {
    return await this.userService.removeUser(id)
  }
}
