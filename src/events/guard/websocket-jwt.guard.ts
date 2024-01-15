import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class WebsocketJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true
    }

    const client: Socket = context.switchToWs().getClient()

    WebsocketJwtGuard.validateToken(this.jwtService, client)
    return true
  }

  static validateToken(jwtService: JwtService, client: Socket) {
    const { authorization } = client.handshake.headers
    if (!authorization) {
      throw new Error('Authorization header is missing')
    }
    const token: string = authorization.split(' ')[1]
    const payload = jwtService.verify(token, {
      secret: process.env.ACCESS_SECRET_KEY,
    })
    return payload
  }
}
