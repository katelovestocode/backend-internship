import { Socket } from 'socket.io'
import { WebsocketJwtGuard } from '../guard/websocket-jwt.guard'
import { JwtService } from '@nestjs/jwt'

export type SocketIOMiddleware = {
  (client: Socket, next: (error?: Error) => void)
}

export const SocketAuthMiddleware = (
  jwtService: JwtService,
): SocketIOMiddleware => {
  return (client, next) => {
    try {
      WebsocketJwtGuard.validateToken(jwtService, client)
      next()
    } catch (error) {
      next(error)
    }
  }
}
