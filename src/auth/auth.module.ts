import { Module } from '@nestjs/common'
import { Auth } from './entities/auth.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/entities/user.entity'
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config'
import { Auth0Strategy } from './strategies/auth0.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Company } from 'src/company/entities/company.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User, Company]),
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule.register({ defaultStrategy: 'auth0' }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, Auth0Strategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
