import { Module } from '@nestjs/common'
import { InvitationService } from './invitation.service'
import { InvitationController } from './invitation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'
import { Invitation } from './entities/invitation.entity'
import { Request } from '../requests/entities/request.entity'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Company, Request, Invitation]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, UserService],
  exports: [InvitationService],
})
export class InvitationModule {}
