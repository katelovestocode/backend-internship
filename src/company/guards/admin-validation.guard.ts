import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Company } from '../entities/company.entity'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class AdminOrOwnerValidGuard implements CanActivate {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const companyId = request.params['companyId']
    const reqEmail = request.user['email']

    if (context.getType() !== 'http') {
      return false
    }

    try {
      const company = await this.companyRepository.findOne({
        where: { id: +companyId },
        relations: ['admins', 'owner'],
      })

      const user = await this.userRepository.findOne({
        where: { email: reqEmail },
      })

      if (!company) {
        throw new BadRequestException('Company does not exist')
      }

      if (!user) {
        throw new BadRequestException('User is not found')
      }

      const isAdmin = company.admins.some((admin) => admin.id === user.id)

      if (!isAdmin && company.owner.id !== user.id) {
        throw new UnauthorizedException(
          'You do not have the necessary permissions.',
        )
      }

      return true
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        throw new BadRequestException('Invalid company or user.')
      }
      throw error
    }
  }
}
