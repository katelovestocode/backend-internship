import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common'
import { UserService } from './user.service'
import {
  DeletedUserResponse,
  UserResponse,
  AllUsersResponse,
} from './types/user.types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get()
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<AllUsersResponse> {
    return await this.userService.getAllUsers()
  }

  // get user by id
  @Get(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async getOneUser(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.getOneUser(id)
  }

  // create user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.createUser(createUserDto)
  }

  // update user
  @Put(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: number,
    @Body() updatedUser: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponse> {
    const reqEmail = req.user.email
    return await this.userService.updateUser(id, updatedUser, reqEmail)
  }

  // delete user
  @Delete(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.OK)
  async removeUser(
    @Param('id') id: number,
    @Request() req,
  ): Promise<DeletedUserResponse> {
    const email = req.user.email
    return await this.userService.removeUser(id, email)
  }
}
