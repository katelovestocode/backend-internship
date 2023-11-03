import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { User } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const { id } = request.params
    const { password, name, email } = request.body
    const reqEmail = request.user['email']

    if (context.getType() !== 'http') {
      return false
    }

    const user = await this.userRepository.findOne({
      where: { id: +id },
    })

    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    if (reqEmail !== user.email) {
      throw new UnauthorizedException('You can only update your own profile')
    }

    if (email) {
      throw new BadRequestException('Users cannot update their own email.')
    }

    if (name) {
      user.name = name
    }

    if (password) {
      user.password = password
    }

    return true
  }
}
