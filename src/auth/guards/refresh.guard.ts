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
    try {
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Refresh' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' })
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.REFRESH_SECRET_KEY,
      })
      req.user = user
      return true
    } catch (error) {
      throw new UnauthorizedException({ message: 'User is not authorized' })
    }
  }
}
