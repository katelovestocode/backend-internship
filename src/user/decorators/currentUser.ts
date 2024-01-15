import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { JwtPayload } from '../types/user.types'

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload,
    context: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    const request = context.switchToHttp().getRequest()
    return key ? request.user[key] : request.user
  },
)
