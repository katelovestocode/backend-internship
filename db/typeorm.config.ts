import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
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
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrationsRun: true,
  logging: 'all',

  // migrations: [__dirname + '/../../db/migrations/*{.ts,.js}'],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // migrations: ['dist/db/migrations/*.js'],
  // entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: [__dirname + '/../src/**/*.entity{.js, .ts}'],
  // migrations: [__dirname + '/migrations/*{.js, .ts}'],
})
