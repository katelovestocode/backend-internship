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
import { UserValidGuard } from './guards/validation.guard'
import { CompanyResponse } from 'src/company/types/types'

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
  async getOneUser(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.getOneUser(+id)
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
  @Put(':userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('userId') id: string,
    @Body() updatedUser: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(+id, updatedUser)
  }

  // delete user
  @Delete(':userId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async removeUser(@Param('userId') id: string): Promise<DeletedUserResponse> {
    return await this.userService.removeUser(+id)
  }

  // user leaves the company
  @Delete('/:userId/companies/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async leaveCompany(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ): Promise<CompanyResponse> {
    return this.userService.userLeavesCompany(+userId, +companyId)
  }
}
