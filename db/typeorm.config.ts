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
  logging: ['query', 'error'],
  // ssl: true,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   }
  // }
})
