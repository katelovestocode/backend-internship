import { registerAs } from '@nestjs/config'

export default registerAs('config', () => ({
  port: process.env.PORT || 3001,
  nodenv: process.env.NODE_ENV,
}))
