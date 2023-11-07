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
export class CompanyValidGuard implements CanActivate {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const { id } = request.params
    const reqEmail = request.user['email']

    if (context.getType() !== 'http') {
      return false
    }

    const company = await this.companyRepository.findOne({
      where: { id: +id },
      relations: ['owner'],
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

    if (company.owner.id !== user.id) {
      throw new UnauthorizedException(
        'You can only update and delete your own companies',
      )
    }

    return true
  }
}
