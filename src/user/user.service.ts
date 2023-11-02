import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
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
    reqEmail: string
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException('User does not exist!')
    }
    if (user.email !== reqEmail) {
      throw new UnauthorizedException('You can only update your own profile')
    }
    if (updatedUser.email) {
      throw new BadRequestException('User cannot update their email.')
    }
    if (updatedUser.name) {
      user.name = updatedUser.name
    }
    if (updatedUser.password) {
      const hashPassword = bcrypt.hashSync(
        updatedUser.password,
        bcrypt.genSaltSync(10),
      )
      user.password = hashPassword
    }

    const newlyUpdatedUser = await this.userRepository.save(user)

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: newlyUpdatedUser,
      },
    }
  }

  async removeUser(id: number, email: string): Promise<DeletedUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    if (user.email !== email) {
      throw new UnauthorizedException('You can only delete your own profile')
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
