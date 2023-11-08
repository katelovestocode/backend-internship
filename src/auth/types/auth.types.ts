export type JwtTokens = {
  accessToken: string
  refreshToken: string
  actionToken: string
}

export type RefreshResponse = JwtTokens & {
  email: string
  id: number
}
