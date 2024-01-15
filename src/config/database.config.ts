import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME,
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [__dirname + '/../../db/migrations/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
}))

export { default as DatabaseConfig } from './database.config'
