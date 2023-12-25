import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NotificationPayload } from './interface/interface'
import { WebsocketJwtGuard } from './guard/websocket-jwt.guard'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly jwtService: JwtService) {}
  private readonly logger = new Logger(EventsGateway.name)

  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await WebsocketJwtGuard.validateToken(
        this.jwtService,
        client,
      )
      if (user) {
        await client.join(user.id.toString())
        this.logger.log(`User ${user.id} is connected`)
      } else {
        client.disconnect()
        this.logger.log(`User ${user.id} is disconnected`)
      }
    } catch (error) {
      this.logger.log('JWT validation error:', error.message)
      client.disconnect()
    }
  }

  async sendNotification({
    userId,
    notification,
  }: NotificationPayload): Promise<void> {
    await this.server.to(`${userId}`).emit('newNotification', notification)
  }
}
