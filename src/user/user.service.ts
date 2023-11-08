import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { Company } from 'src/company/entities/company.entity'
import { CompanyResponse } from 'src/company/types/types'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getAllUsers(): Promise<AllUsersResponse> {
    try {
      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          users: await this.userRepository.find(),
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getOneUser(id: number): Promise<UserResponse> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async createUser(user: CreateUserDto): Promise<UserResponse> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateUser(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { id } })

      if (!user) {
        throw new NotFoundException('User do not exist!')
      }

      if (updatedUser.password) {
        updatedUser.password = bcrypt.hashSync(
          updatedUser.password,
          bcrypt.genSaltSync(10),
        )
      }

      if (updatedUser.email) {
        throw new BadRequestException('Users cannot update their own email.')
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async removeUser(id: number): Promise<DeletedUserResponse> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { email },
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async userLeavesCompany(
    userId: number,
    companyId: number,
  ): Promise<CompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: +companyId },
        relations: ['members'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const userToRemove = company.members.find((user) => user.id === userId)

      if (!userToRemove) {
        throw new NotFoundException(
          'User is not found in the company members list',
        )
      }

      company.members = company.members.filter((user) => user.id !== userId)
      const updated = await this.companyRepository.save(company)

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          company: updated,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
