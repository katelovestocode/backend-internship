import { Module } from '@nestjs/common'
import { RequestService } from './request.service'
import { RequestController } from './request.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'
import { Request } from './entities/request.entity'
import { Invitation } from '../invitations/entities/invitation.entity'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Company, Request, Invitation]),
  ],
  controllers: [RequestController],
  providers: [RequestService, UserService],
  exports: [RequestService],
})
export class RequestModule {}
