import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = await app.get(ConfigService);
  const port = config.get<number>('PORT');
  await app.listen(port || 3001);
}
bootstrap();
