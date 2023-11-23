import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Notification, ServerToClientEvents } from './interface/interface'
import { WebsocketJwtGuard } from './guard/websocket-jwt.guard'
import { Logger, UseGuards } from '@nestjs/common'
import { SocketAuthMiddleware } from './middleware/ws.middleware'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
@UseGuards(WebsocketJwtGuard)
export class EventsGateway {
  constructor(private readonly jwtService: JwtService) {}
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware(this.jwtService) as any)
    Logger.log('afterInit')
  }

  async sendNotification(notification: Notification): Promise<void> {
    this.server.emit('newNotification', notification)
  }
}
