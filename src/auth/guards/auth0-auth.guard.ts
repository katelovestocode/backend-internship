import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class Auth0Strategy extends AuthGuard('auth0') {}
