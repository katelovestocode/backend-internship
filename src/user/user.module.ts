import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from 'src/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { Auth } from 'src/auth/entities/auth.entity'
import { ValidationGuard } from './guards/validation.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth]), AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtService, ValidationGuard],
  exports: [UserService],
})
export class UserModule {}
