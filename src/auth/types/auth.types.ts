export type JwtTokens = {
  accessToken: string
  refreshToken: string
  actionToken: string
}

export type RefreshResponse = JwtTokens & {
  email: string
  name: string
  id: number
}

export type RefreshType = {
  details: {
    user: RefreshResponse
  }
}
