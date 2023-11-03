import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { RefresJwtGuard } from './guards/refresh.guard'
import { AuthGuard } from '@nestjs/passport'
import {
  JwtPayload,
  LoginResponse,
  UserResponse,
} from 'src/user/types/user.types'
import { RefreshResponse } from './types/auth.types'
import { CurrentUser } from 'src/user/decorators/currentUser'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.authService.register(createUserDto)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto)
  }

  @Post('/refresh')
  @UseGuards(RefresJwtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @CurrentUser() user: JwtPayload,
  ): Promise<RefreshResponse> {
    return await this.authService.refreshTokens(user)
  }

  @Get('/me')
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  @HttpCode(HttpStatus.OK)
  async getCurrentUserStatus(
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponse> {
    return await this.authService.getCurrent(user)
  }
}
