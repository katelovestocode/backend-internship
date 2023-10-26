import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { Auth } from '../src/auth/entities/auth.entity'
import { User } from '../src/user/entities/user.entity'
import { DataSource } from 'typeorm'

config()

const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  // entities: ['User, Auth'],
  // entities: [__dirname + '/../src/**/*.entity{.js, .ts}'],
  // logging: configService.get('nodenv') === 'development',
  // migrations: [__dirname + '/migrations/*{.js, .ts}'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
})
