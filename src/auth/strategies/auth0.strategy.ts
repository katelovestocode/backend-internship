import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { passportJwtSecret } from 'jwks-rsa'
import { UserService } from '../../user/user.service'

function generateRandomPassword(length: number): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?'
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset.charAt(randomIndex)
  }
  return password
}

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>(
          'AUTH0_ISSUER_URL',
          '',
        )}.well-known/jwks.json`,
      }),
      audience: configService.get<string>('AUTH0_AUDIENCE', ''),
      issuer: configService.get<string>('AUTH0_ISSUER_URL', ''),
      algorithms: ['RS256'],
      usernameField: 'email',
    })
  }

  async validate(payload: any) {
    const userExist = await this.userService.getUserByEmail(payload.email)

    if (!userExist) {
      const randomPassword = generateRandomPassword(11)
      const newUser = {
        email: payload.email,
        name: payload.name,
        password: randomPassword,
      }
      await this.userService.createUser(newUser)
      return { email: payload.email }
    }
    return { email: payload.email, name: payload.name }
  }
}
