import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { HttpExceptionFilter } from './config/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors()
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const config = await app.get(ConfigService)
  const port = config.get<number>('PORT')
  await app.listen(port || 3001)
}
bootstrap()
