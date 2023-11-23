import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NotificationPayload } from './interface/interface'
import { WebsocketJwtGuard } from './guard/websocket-jwt.guard'
import { Logger, UseGuards } from '@nestjs/common'
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
  private readonly logger = new Logger(EventsGateway.name)

  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket): Promise<void> {
    const user = await WebsocketJwtGuard.validateToken(this.jwtService, client)

    if (user) {
      await client.join(user.id.toString())
      this.logger.log(`User ${user.id} is connected`)
    } else {
      client.disconnect()
      this.logger.log(`User ${user.id} is disconnected`)
    }
  }

  async sendNotification({
    userId,
    notification,
  }: NotificationPayload): Promise<void> {
    await this.server.to(`${userId}`).emit('newNotification', notification)
  }
}
