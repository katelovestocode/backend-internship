import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Auth } from './entities/auth.entity'
import { JwtTokens, RefreshResponse } from './types/auth.types'
import { LoginResponse, UserResponse } from 'src/user/types/user.types'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  // generate token
  private async generateTokens(user: User): Promise<JwtTokens> {
    const payload = { email: user.email, id: user.id }

    const [accessToken, refreshToken, actionToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_SECRET_KEY,
        expiresIn: '10m',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: '24h',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.ACTION_SECRET_KEY,
        expiresIn: '5m',
      }),
    ])

    return { accessToken, refreshToken, actionToken }
  }

  // register
  async register(createUserDto: CreateUserDto): Promise<UserResponse> {
    const candidate = await this.userService.getUserByEmail(createUserDto.email)

    if (candidate) {
      throw new BadRequestException('User with this email exists!')
    }
    const user = await this.userService.createUser(createUserDto)

    const auth = new Auth()
    auth.accessToken = ''
    auth.refreshToken = ''
    auth.actionToken = ''

    auth.user = user.details.user

    await this.authRepository.save(auth)

    return user
  }

  // validate user
  private async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.getUserByEmail(loginDto.email)

    if (user === null || !user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const validPasssword = await bcrypt.compare(
      loginDto.password,
      user.password,
    )
    if (!validPasssword) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return user
  }

  // login
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto)

    const tokens = await this.generateTokens(user)
    const { accessToken, refreshToken, actionToken } = tokens

    await this.authRepository.update(user.id, tokens)

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: { ...user, accessToken, refreshToken, actionToken },
      },
    }
  }

  //refresh token
  async refreshTokens(user: any): Promise<RefreshResponse> {
    const { id, email } = user

    const findUser = await this.userService.getUserByEmail(email)
    if (findUser === null || !findUser) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const newTokens = await this.generateTokens(user)

    const { accessToken, refreshToken, actionToken } = newTokens
    await this.authRepository.update(user.id, newTokens)

    return { id, email, accessToken, refreshToken, actionToken }
  }

  // get current or /me
  async getCurrent(user: any): Promise<UserResponse> {
    const findUser = await this.userService.getUserByEmail(user.email)
    const { id, name, email, password, createdAt, updatedAt, auth } = findUser

    return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        user: { id, name, email, password, createdAt, updatedAt, auth },
      },
    }
  }
}
