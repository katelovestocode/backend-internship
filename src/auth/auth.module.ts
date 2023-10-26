import { Module } from '@nestjs/common';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [],
  providers: [],
})
export class AuthModule {}
