import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME,
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.js, .ts}'],
  synchronize: true,
  logging: true,
  autoLoadEntities: true,
  // entities: [`${__dirname}/../**/*.entity{.js, .ts}`],
  //migrations: [__dirname + '/../../migrations/*{.js, .ts}'],
  //migrationsTableName: 'migrations',
 
}))
