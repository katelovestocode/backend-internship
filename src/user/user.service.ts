import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
  DeletedUserResponse,
  UserResponse,
  AllUsersResponse,
} from './types/user.types'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<AllUsersResponse> {
    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        users: await this.userRepository.find(),
      },
    }
  }

  async getOneUser(id: number): Promise<UserResponse> {
    const oneUser = await this.userRepository.findOne({ where: { id } })

    if (!oneUser) {
      throw new NotFoundException('User do not exist!')
    }

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: oneUser,
      },
    }
  }

  async createUser(user: CreateUserDto): Promise<UserResponse> {
    const password = user.password
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    const newUser = await this.userRepository.create({
      ...user,
      password: hashPassword,
    })

    await this.userRepository.save(newUser)

    return {
      status_code: HttpStatus.CREATED,
      result: 'success',
      details: {
        user: newUser,
      },
    }
  }

  async updateUser(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException('User do not exist!')
    }

    await this.userRepository.update(id, updatedUser)

    const newlyUpdatedUser = await this.userRepository.findOne({
      where: { id },
    })

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: newlyUpdatedUser,
      },
    }
  }

  async removeUser(id: number): Promise<DeletedUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException('User do not exist!')
    }
    await this.userRepository.delete(id)

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: id,
      },
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
    })
  }
}
