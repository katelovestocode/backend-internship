import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class RefresJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    console.log(req.body.refreshToken, 'req')
    try {
      const user = this.jwtService.verify(req.body.refreshToken, {
        secret: process.env.REFRESH_SECRET_KEY,
      })

      req.user = user
      return true
    } catch (error) {
      throw new UnauthorizedException({ message: 'User is not authorized' })
    }
  }
}
