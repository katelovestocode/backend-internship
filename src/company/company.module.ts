import { Module } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { User } from 'src/user/entities/user.entity'
import { Company } from './entities/company.entity'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([Auth, User, Company])],
  controllers: [CompanyController],
  providers: [CompanyService, UserService],
  exports: [CompanyService],
})
export class CompanyModule {}
